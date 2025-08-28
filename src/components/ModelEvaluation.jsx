import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Gauge,
  LineChart,
  Scale,
  Brain,
  Sigma,
  Target,
  SlidersHorizontal,
  RotateCcw,
  Play,
  Pause,
  Download,
  Info,
  AlertTriangle,
  CheckCircle2,
  Wand2,
} from "lucide-react";

// ------------------------------------------------------------
// Utility helpers
// ------------------------------------------------------------
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const logit = (p) => Math.log(clamp(p, 1e-6, 1 - 1e-6) / (1 - clamp(p, 1e-6, 1 - 1e-6)));

// Simple Gamma(k, 1) using sum of exponentials (works for integer k)
const sampleGammaK = (k) => {
  let x = 0;
  for (let i = 0; i < k; i++) x += -Math.log(Math.random());
  return x;
};
// Beta(a,b) using two Gammas (a,b integers for stability here)
const sampleBeta = (a, b) => {
  const x = sampleGammaK(a);
  const y = sampleGammaK(b);
  return x / (x + y);
};

const fmtPct = (p, digits = 1) => `${(p * 100).toFixed(digits)}%`;
const safeDiv = (num, den) => (den === 0 ? 0 : num / den);

// ------------------------------------------------------------
// Synthetic data generation
// ------------------------------------------------------------
function generateDataset(N, baseRate = 0.3, groupSkew = 0.5) {
  // groupSkew = fraction in Group A (rest in Group B)
  const data = [];
  for (let i = 0; i < N; i++) {
    const label = Math.random() < baseRate ? 1 : 0;
    // nicer class separation but overlapping
    const score = label ? sampleBeta(5, 2) : sampleBeta(2, 5);
    const group = Math.random() < groupSkew ? "A" : "B";
    data.push({ id: i + 1, score, label, group });
  }
  return data.sort((a, b) => b.score - a.score);
}

// Confusion + metrics given threshold
function computeMetrics(data, threshold) {
  let TP = 0,
    FP = 0,
    TN = 0,
    FN = 0;
  for (const d of data) {
    const pred = d.score >= threshold ? 1 : 0;
    if (pred === 1 && d.label === 1) TP++;
    else if (pred === 1 && d.label === 0) FP++;
    else if (pred === 0 && d.label === 0) TN++;
    else if (pred === 0 && d.label === 1) FN++;
  }
  const P = TP + FN;
  const N = TN + FP;
  const precision = safeDiv(TP, TP + FP);
  const recall = safeDiv(TP, P);
  const tpr = recall;
  const fpr = safeDiv(FP, N);
  const specificity = 1 - fpr;
  const accuracy = safeDiv(TP + TN, P + N);
  const f1 = safeDiv(2 * precision * recall, precision + recall);
  const balancedAcc = (tpr + specificity) / 2;
  const denomMCC = Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
  const mcc = denomMCC === 0 ? 0 : (TP * TN - FP * FN) / denomMCC;
  const po = accuracy;
  const pe = safeDiv((TP + FP) * (TP + FN) + (FN + TN) * (FP + TN), (P + N) * (P + N));
  const kappa = safeDiv(po - pe, 1 - pe);
  return {
    TP,
    FP,
    TN,
    FN,
    precision,
    recall,
    tpr,
    fpr,
    specificity,
    accuracy,
    f1,
    balancedAcc,
    mcc,
    kappa,
    P,
    N,
  };
}

function computeROC(data) {
  const thresholds = [];
  for (let t = 0; t <= 100; t++) thresholds.push(t / 100);
  const points = thresholds.map((thr) => {
    const m = computeMetrics(data, thr);
    return { thr, fpr: m.fpr, tpr: m.tpr };
  });
  // AUC via trapezoid (sort by FPR)
  const sorted = [...points].sort((a, b) => a.fpr - b.fpr);
  let auc = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    const x1 = sorted[i].fpr,
      x2 = sorted[i + 1].fpr,
      y1 = sorted[i].tpr,
      y2 = sorted[i + 1].tpr;
    auc += (x2 - x1) * (y1 + y2) * 0.5;
  }
  return { points, auc: clamp(auc, 0, 1) };
}

function computePR(data) {
  const thresholds = [];
  for (let t = 0; t <= 100; t++) thresholds.push(t / 100);
  const points = thresholds.map((thr) => {
    const m = computeMetrics(data, thr);
    return { thr, recall: m.recall, precision: m.precision };
  });
  // AP (area under PR) approx.
  const sorted = [...points].sort((a, b) => a.recall - b.recall);
  let ap = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    const x1 = sorted[i].recall,
      x2 = sorted[i + 1].recall,
      y1 = sorted[i].precision,
      y2 = sorted[i + 1].precision;
    ap += (x2 - x1) * ((y1 + y2) / 2);
  }
  return { points, ap: clamp(ap, 0, 1) };
}

function computeCalibration(data, bins = 10) {
  const counts = Array(bins).fill(0);
  const sumScore = Array(bins).fill(0);
  const sumLabel = Array(bins).fill(0);
  for (const d of data) {
    const b = Math.min(bins - 1, Math.floor(d.score * bins));
    counts[b]++;
    sumScore[b] += d.score;
    sumLabel[b] += d.label;
  }
  const rows = [];
  let ece = 0;
  const N = data.length;
  for (let b = 0; b < bins; b++) {
    const n = counts[b];
    if (n === 0) {
      rows.push({ bin: b + 1, conf: 0, acc: 0, n: 0 });
      continue;
    }
    const conf = sumScore[b] / n;
    const acc = sumLabel[b] / n;
    ece += (n / N) * Math.abs(acc - conf);
    rows.push({ bin: b + 1, conf, acc, n });
  }
  return { rows, ece };
}

function computeLift(data, buckets = 10) {
  const sorted = [...data].sort((a, b) => b.score - a.score);
  const N = sorted.length;
  const P = sorted.reduce((s, d) => s + d.label, 0);
  const rows = [];
  for (let k = 1; k <= buckets; k++) {
    const upto = Math.floor((k / buckets) * N);
    const slice = sorted.slice(0, upto);
    const hits = slice.reduce((s, d) => s + d.label, 0);
    const capture = safeDiv(hits, P);
    const baseline = k / buckets;
    const lift = safeDiv(capture, baseline);
    rows.push({ bucket: k, capture, lift });
  }
  return rows;
}

function fairnessByGroup(data, threshold) {
  const groups = { A: { TP: 0, FP: 0, TN: 0, FN: 0, P: 0, N: 0 }, B: { TP: 0, FP: 0, TN: 0, FN: 0, P: 0, N: 0 } };
  for (const d of data) {
    const pred = d.score >= threshold ? 1 : 0;
    const g = groups[d.group];
    if (d.label === 1) g.P++;
    else g.N++;
    if (pred === 1 && d.label === 1) g.TP++;
    else if (pred === 1 && d.label === 0) g.FP++;
    else if (pred === 0 && d.label === 0) g.TN++;
    else if (pred === 0 && d.label === 1) g.FN++;
  }
  const m = {};
  for (const k of Object.keys(groups)) {
    const g = groups[k];
    const precision = safeDiv(g.TP, g.TP + g.FP);
    const recall = safeDiv(g.TP, g.P);
    const fpr = safeDiv(g.FP, g.N);
    m[k] = { precision, recall, fpr, ...g };
  }
  const gaps = {
    tprGap: Math.abs((m.A.recall || 0) - (m.B.recall || 0)),
    fprGap: Math.abs((m.A.fpr || 0) - (m.B.fpr || 0)),
    ppvGap: Math.abs((m.A.precision || 0) - (m.B.precision || 0)),
  };
  return { groups: m, gaps };
}

// Temperature scaling (for what-if calibration)
function applyTemperature(data, T) {
  if (T === 1) return data;
  return data.map((d) => {
    const z = logit(d.score) / T;
    return { ...d, score: clamp(sigmoid(z), 0, 1) };
  });
}

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------
const ModelEvaluationModule = () => {
  // Simulation controls
  const [N, setN] = useState(800);
  const [baseRate, setBaseRate] = useState(0.3);
  const [groupSkew, setGroupSkew] = useState(0.5); // 0..1 share in Group A
  const [temperature, setTemperature] = useState(1.0);
  const [threshold, setThreshold] = useState(0.5);
  const [costFP, setCostFP] = useState(1);
  const [costFN, setCostFN] = useState(5);
  const [autoSweep, setAutoSweep] = useState(false);
  const [sweepDir, setSweepDir] = useState(1); // 1 or -1
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [ci, setCi] = useState({ auc: null, f1: null });

  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const reseed = () => setSeed(Math.floor(Math.random() * 1e9));

  // Generate dataset (memoized by seed + params)
  const rawData = useMemo(() => generateDataset(N, baseRate, groupSkew), [N, baseRate, groupSkew, seed]);
  const data = useMemo(() => applyTemperature(rawData, temperature), [rawData, temperature]);

  const metrics = useMemo(() => computeMetrics(data, threshold), [data, threshold]);
  const roc = useMemo(() => computeROC(data), [data]);
  const pr = useMemo(() => computePR(data), [data]);
  const calib = useMemo(() => computeCalibration(data, 10), [data]);
  const lift = useMemo(() => computeLift(data, 10), [data]);
  const fair = useMemo(() => fairnessByGroup(data, threshold), [data, threshold]);

  const expectedCost = useMemo(() => metrics.FP * costFP + metrics.FN * costFN, [metrics, costFP, costFN]);

  // Auto sweep threshold animation
  useEffect(() => {
    if (!autoSweep) return;
    const iv = setInterval(() => {
      setThreshold((t) => {
        let nt = t + sweepDir * 0.01;
        if (nt > 0.99) {
          nt = 0.99;
          setSweepDir(-1);
        }
        if (nt < 0.01) {
          nt = 0.01;
          setSweepDir(1);
        }
        return Number(nt.toFixed(2));
      });
    }, 80);
    return () => clearInterval(iv);
  }, [autoSweep, sweepDir]);

  // Threshold finders / optimizers
  const candidateThresholds = useMemo(() => Array.from({ length: 99 }, (_, i) => (i + 1) / 100), []);

  function findBest(metricName) {
    let bestT = 0.5,
      bestV = -Infinity;
    for (const t of candidateThresholds) {
      const m = computeMetrics(data, t);
      const v = m[metricName];
      if (v > bestV) {
        bestV = v;
        bestT = t;
      }
    }
    return { t: bestT, v: bestV };
  }

  function findMinCost() {
    let bestT = 0.5,
      bestC = Infinity;
    for (const t of candidateThresholds) {
      const m = computeMetrics(data, t);
      const c = m.FP * costFP + m.FN * costFN;
      if (c < bestC) {
        bestC = c;
        bestT = t;
      }
    }
    return { t: bestT, c: bestC };
  }

  function thresholdForConstraint(kind, target) {
    // kind: 'precision' | 'recall'
    let chosen = 0.5;
    if (kind === "precision") {
      let best = 1;
      for (const t of candidateThresholds) {
        const m = computeMetrics(data, t);
        if (m.precision >= target && Math.abs(m.recall - best) < Math.abs(m.recall - best)) {
          chosen = t;
          best = m.recall; // keep the highest recall among feasible
        }
      }
    } else if (kind === "recall") {
      let best = 1;
      for (const t of candidateThresholds) {
        const m = computeMetrics(data, t);
        if (m.recall >= target && Math.abs(m.precision - best) < Math.abs(m.precision - best)) {
          chosen = t;
          best = m.precision; // keep the highest precision among feasible
        }
      }
    }
    return chosen;
  }

  // Bootstrap CIs for AUC and F1
  const runBootstrap = async () => {
    setIsBootstrapping(true);
    const B = 80; // number of bootstrap samples (keep reasonable for UI)
    const aucs = [];
    const f1s = [];
    for (let b = 0; b < B; b++) {
      // resample indices with replacement
      const res = [];
      for (let i = 0; i < data.length; i++) {
        res.push(data[Math.floor(Math.random() * data.length)]);
      }
      const aucB = computeROC(res).auc;
      const f1B = computeMetrics(res, threshold).f1;
      aucs.push(aucB);
      f1s.push(f1B);
      // allow paint
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 0));
    }
    aucs.sort((a, b) => a - b);
    f1s.sort((a, b) => a - b);
    const q = (arr, p) => arr[Math.floor(p * (arr.length - 1))];
    setCi({ auc: [q(aucs, 0.025), q(aucs, 0.975)], f1: [q(f1s, 0.025), q(f1s, 0.975)] });
    setIsBootstrapping(false);
  };

  // Export CSV
  const exportCSV = () => {
    const header = ["id", "score", "label", "group", "pred@thr"].join(",");
    const lines = data.map((d) => `${d.id},${d.score.toFixed(6)},${d.label},${d.group},${d.score >= threshold ? 1 : 0}`);
    const blob = new Blob([header + "\n" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eval_predictions_N${data.length}_thr${threshold}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Derived UI helpers
  const severeFairness = fair.gaps.tprGap > 0.1 || fair.gaps.fprGap > 0.1 || fair.gaps.ppvGap > 0.1;

  // Chart helpers
  const Chart = ({ children, title }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      {title && <h5 className="font-bold text-gray-700 mb-3">{title}</h5>}
      <div className="relative h-48 bg-gray-50 rounded-lg p-3 overflow-hidden">
        {children}
      </div>
    </div>
  );

  const drawCurve = (pts, xKey, yKey, w = 300, h = 160) =>
    pts
      .map((p, i) => `${(p[xKey] ?? 0) * w},${h - (p[yKey] ?? 0) * h}`)
      .join(" ");

  const confusion = [
    [metrics.TP, metrics.FP],
    [metrics.FN, metrics.TN],
  ];

  // Top uncertain samples (closest to threshold)
  const uncertain = useMemo(() => {
    const withDist = data.map((d) => ({ ...d, dist: Math.abs(d.score - threshold) }));
    withDist.sort((a, b) => a.dist - b.dist);
    return withDist.slice(0, 8);
  }, [data, threshold]);

  return (
    <div className="space-y-10 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white rounded-2xl shadow-lg">
            <BarChart3 className="w-12 h-12" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Model Evaluation & Diagnostics</h1>
            <p className="text-lg text-gray-600">Beyond accuracy: calibration, fairness, costs and decisions.</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl text-sm text-gray-600 flex items-start gap-2 bg-gradient-to-r from-indigo-50 to-fuchsia-50 p-4 border border-indigo-200 rounded-2xl">
          <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
          <p>
            This module simulates a binary classifier's evaluation using a synthetic dataset. Tune thresholds, explore ROC/PR curves, check calibration and fairness, and even optimize thresholds for business costs. It’s a lab for post-training decisions.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-fuchsia-50 p-6 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><SlidersHorizontal className="w-6 h-6 text-indigo-600"/> Evaluation Controls</h2>
          <div className="flex gap-2">
            <button onClick={reseed} className="px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold flex items-center gap-2"><RotateCcw className="w-4 h-4"/>Regenerate Data</button>
            <button onClick={() => setAutoSweep((s) => !s)} className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${autoSweep ? "bg-red-600 hover:bg-red-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>{autoSweep ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}{autoSweep ? "Pause Sweep" : "Auto Sweep"}</button>
            <button onClick={exportCSV} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2"><Download className="w-4 h-4"/>Export CSV</button>
          </div>
        </div>

        {/* Sliders grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Threshold: {threshold.toFixed(2)}</label>
            <input type="range" min={0.01} max={0.99} step={0.01} value={threshold} onChange={(e) => setThreshold(parseFloat(e.target.value))} className="w-full" />
            <div className="text-xs text-gray-500 mt-1">Adjust the decision boundary. Affects confusion matrix, metrics, and fairness.</div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Dataset Size (N): {N}</label>
            <input type="range" min={200} max={5000} step={100} value={N} onChange={(e) => setN(parseInt(e.target.value))} className="w-full" />
            <div className="text-xs text-gray-500 mt-1">Larger N reduces variance and tightens confidence intervals.</div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Base Rate (Positives): {fmtPct(baseRate)}</label>
            <input type="range" min={0.05} max={0.8} step={0.01} value={baseRate} onChange={(e) => setBaseRate(parseFloat(e.target.value))} className="w-full" />
            <div className="text-xs text-gray-500 mt-1">Controls class imbalance in the synthetic data.</div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Group A Share: {fmtPct(groupSkew)}</label>
            <input type="range" min={0.2} max={0.8} step={0.01} value={groupSkew} onChange={(e) => setGroupSkew(parseFloat(e.target.value))} className="w-full" />
            <div className="text-xs text-gray-500 mt-1">Imbalance across sub-populations for fairness stress testing.</div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Calibration Temperature: {temperature.toFixed(2)}</label>
            <input type="range" min={0.5} max={2} step={0.01} value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full" />
            <div className="text-xs text-gray-500 mt-1">&lt;1 sharpens, &gt;1 softens predicted probabilities (what-if calibration).</div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Cost of FP: {costFP.toFixed(1)} &nbsp; | &nbsp; Cost of FN: {costFN.toFixed(1)}</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="range" min={0} max={10} step={0.5} value={costFP} onChange={(e) => setCostFP(parseFloat(e.target.value))} className="w-full" />
              <input type="range" min={0} max={10} step={0.5} value={costFN} onChange={(e) => setCostFN(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div className="text-xs text-gray-500 mt-1">Optimize business impact under asymmetric costs.</div>
          </div>
        </div>

        {/* Optimizers row */}
        <div className="p-6 border-t border-gray-100 flex flex-wrap gap-3">
          <button onClick={() => setThreshold(findBest("f1").t)} className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2"><Target className="w-4 h-4"/>Maximize F1</button>
          <button onClick={() => setThreshold(findBest("mcc").t)} className="px-3 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold flex items-center gap-2"><Sigma className="w-4 h-4"/>Maximize MCC</button>
          <button onClick={() => setThreshold(findMinCost().t)} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center gap-2"><Scale className="w-4 h-4"/>Minimize Expected Cost</button>
          <button onClick={runBootstrap} disabled={isBootstrapping} className={`px-3 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-2 ${isBootstrapping ? "bg-gray-400" : "bg-slate-700 hover:bg-slate-800"}`}>{isBootstrapping ? <Wand2 className="w-4 h-4"/> : <Brain className="w-4 h-4"/>}{isBootstrapping ? "Estimating CIs…" : "Estimate 95% CIs"}</button>
          {ci.auc && (
            <div className="text-xs text-gray-600 flex items-center gap-3">
              <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">AUC 95% CI: {ci.auc[0].toFixed(3)} – {ci.auc[1].toFixed(3)}</span>
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">F1 95% CI: {ci.f1[0].toFixed(3)} – {ci.f1[1].toFixed(3)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Key metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-indigo-600">{fmtPct(metrics.precision)}</div>
          <div className="text-sm text-gray-600">Precision (PPV)</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-fuchsia-600">{fmtPct(metrics.recall)}</div>
          <div className="text-sm text-gray-600">Recall (TPR)</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-emerald-600">{fmtPct(metrics.f1)}</div>
          <div className="text-sm text-gray-600">F1 Score</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-pink-600">{fmtPct(roc.auc)}</div>
          <div className="text-sm text-gray-600">ROC AUC</div>
        </div>
      </div>

      {/* Curves & Diagrams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROC */}
        <Chart title="ROC Curve (TPR vs FPR)">
          <svg width="100%" height="100%" viewBox="0 0 320 180" className="overflow-visible">
            <polyline points="0,160 160,0 320,0" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            <polyline
              points={drawCurve(roc.points.map(p=>({ x:p.fpr, y:p.tpr })), "x", "y", 300, 160)}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
            />
            {/* Current operating point */}
            {(() => {
              const m = computeMetrics(data, threshold);
              const x = m.fpr * 300;
              const y = 160 - m.tpr * 160;
              return <circle cx={x} cy={y} r={4} className="fill-fuchsia-500" />;
            })()}
            <text x={5} y={15} className="text-[10px] fill-gray-600">AUC: {roc.auc.toFixed(3)}</text>
          </svg>
        </Chart>

        {/* PR */}
        <Chart title="Precision–Recall Curve">
          <svg width="100%" height="100%" viewBox="0 0 320 180" className="overflow-visible">
            <polyline
              points={drawCurve(pr.points.map(p=>({ x:p.recall, y:p.precision })), "x", "y", 300, 160)}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
            />
            {(() => {
              const m = computeMetrics(data, threshold);
              const x = m.recall * 300;
              const y = 160 - m.precision * 160;
              return <circle cx={x} cy={y} r={4} className="fill-indigo-500" />;
            })()}
            <text x={5} y={15} className="text-[10px] fill-gray-600">AP (area ≈): {pr.ap.toFixed(3)}</text>
          </svg>
        </Chart>

        {/* Calibration */}
        <Chart title={`Reliability Diagram (ECE: ${calib.ece.toFixed(3)})`}>
          <svg width="100%" height="100%" viewBox="0 0 320 180" className="overflow-visible">
            <polyline points="0,160 160,0 320,0" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            {calib.rows.map((r, i) => {
              const x = (i / calib.rows.length) * 300 + 15;
              const w = 300 / calib.rows.length - 4;
              const y = 160 - r.acc * 160;
              const y2 = 160 - r.conf * 160;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={w} height={160 - y} className="fill-emerald-200" />
                  <rect x={x} y={y2} width={w} height={2} className="fill-emerald-700" />
                </g>
              );
            })}
            <text x={5} y={15} className="text-[10px] fill-gray-600">Bars: observed accuracy; line: mean confidence</text>
          </svg>
        </Chart>

        {/* Lift / Gain */}
        <Chart title="Lift Chart (Top Deciles)">
          <svg width="100%" height="100%" viewBox="0 0 320 180" className="overflow-visible">
            {lift.map((r, i) => {
              const w = 24;
              const gap = 6;
              const x = 20 + i * (w + gap);
              const h = Math.min(150, r.lift * 40);
              return <rect key={i} x={x} y={160 - h} width={w} height={h} className="fill-pink-400"/>;
            })}
            <text x={5} y={15} className="text-[10px] fill-gray-600">Lift &gt; 1 means better than random targeting</text>
          </svg>
        </Chart>
      </div>

      {/* Confusion Matrix & Cost */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Gauge className="w-5 h-5 text-indigo-600"/>Confusion Matrix @ {threshold.toFixed(2)}</h4>
          <div className="grid grid-cols-2 gap-2 w-64 mx-auto">
            {confusion.map((row, i) =>
              row.map((val, j) => (
                <div key={`${i}-${j}`} className={`p-4 text-center rounded-lg font-bold ${i === j ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                  {val}
                </div>
              ))
            )}
          </div>
          <div className="text-xs text-gray-600 text-center mt-3">TP / FP / FN / TN with current threshold</div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>Accuracy: <span className="font-semibold">{fmtPct(metrics.accuracy)}</span></div>
            <div>Specificity: <span className="font-semibold">{fmtPct(metrics.specificity)}</span></div>
            <div>Balanced Acc: <span className="font-semibold">{fmtPct(metrics.balancedAcc)}</span></div>
            <div>MCC: <span className="font-semibold">{metrics.mcc.toFixed(3)}</span></div>
            <div>Kappa: <span className="font-semibold">{metrics.kappa.toFixed(3)}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Scale className="w-5 h-5 text-emerald-600"/>Cost Analysis</h4>
          <div className="text-3xl font-extrabold text-emerald-600">{expectedCost.toFixed(1)}</div>
          <div className="text-sm text-gray-600 mb-4">Expected cost = FP×{costFP} + FN×{costFN}</div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setThreshold(findMinCost().t)} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold">Set Min-Cost Threshold</button>
            <button onClick={() => setThreshold(thresholdForConstraint('precision', 0.9))} className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold">Precision ≥ 90%</button>
            <button onClick={() => setThreshold(thresholdForConstraint('recall', 0.9))} className="px-3 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold">Recall ≥ 90%</button>
          </div>
          <div className="mt-4 text-xs text-gray-600">Use constraints to meet regulatory or product SLAs.</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Brain className="w-5 h-5 text-fuchsia-600"/>Uncertain Samples</h4>
          <div className="grid grid-cols-2 gap-3">
            {uncertain.map((u) => (
              <div key={u.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500">id {u.id} • grp {u.group}</div>
                <div className="font-mono text-sm">score: {u.score.toFixed(3)}</div>
                <div className="text-xs">label: <span className={`font-semibold ${u.label ? 'text-emerald-700' : 'text-rose-700'}`}>{u.label}</span></div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-600 mt-2">Closest to threshold — useful for manual review or active learning.</div>
        </div>
      </div>

      {/* Fairness audit */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Scale className="w-5 h-5 text-rose-600"/> Fairness Audit</h3>
          {severeFairness ? (
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-sm flex items-center gap-1"><AlertTriangle className="w-4 h-4"/>Potential bias detected</span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/>No large gaps</span>
          )}
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {(["A", "B"]).map((g) => (
                <div key={g} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Group {g}</div>
                  <div>TPR: <span className="font-semibold">{fmtPct(fair.groups[g].recall || 0)}</span></div>
                  <div>FPR: <span className="font-semibold">{fmtPct(fair.groups[g].fpr || 0)}</span></div>
                  <div>PPV: <span className="font-semibold">{fmtPct(fair.groups[g].precision || 0)}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-sm">Gaps (|A−B|):</div>
              <div className="grid grid-cols-3 gap-3 mt-2 text-sm">
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">TPR gap: <span className="font-semibold">{(fair.gaps.tprGap).toFixed(3)}</span></div>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">FPR gap: <span className="font-semibold">{(fair.gaps.fprGap).toFixed(3)}</span></div>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">PPV gap: <span className="font-semibold">{(fair.gaps.ppvGap).toFixed(3)}</span></div>
              </div>
              <div className="text-xs text-gray-600 mt-3">Try shifting the threshold, adjusting temperature, or rebalancing groups to explore mitigation.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Guidance & Checklist */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-3xl p-6 border border-gray-200">
        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2"><LineChart className="w-5 h-5 text-slate-700"/>Evaluation Playbook</h4>
        <ol className="list-decimal ml-6 text-sm text-gray-700 space-y-2">
          <li><span className="font-semibold">Pick your operating point:</span> use ROC/PR plus business costs to set a threshold.</li>
          <li><span className="font-semibold">Validate calibration:</span> low ECE means scores reflect actual likelihoods. Consider temperature scaling if needed.</li>
          <li><span className="font-semibold">Stress-test fairness:</span> check TPR/FPR/PPV gaps across groups and mitigate if large.</li>
          <li><span className="font-semibold">Quantify uncertainty:</span> bootstrap to get confidence intervals for AUC/F1.</li>
          <li><span className="font-semibold">Monitor in production:</span> track drift in base rate and subgroup mix; alert on metric drops.</li>
        </ol>
      </div>
    </div>
  );
};

export default ModelEvaluationModule;
