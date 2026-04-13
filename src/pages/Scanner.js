import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';

const MANUFACTURERS = ['Vadio', 'Crestron', 'Extron', 'Epson', 'Bi-amp'];

const LOCATIONS = [
  'Alumni Hall',
  'Andrew J. Talley Athletic Center',
  'Angelo Hall',
  'Austin Hall',
  'Bartley Hall',
  'Burns Hall',
  'Canon Hall',
  'Caughlin Hall',
  'Charles Widger School of Law',
  'Chemical Engineering Building',
  "Children's School of Villanova University",
  'College of Liberal Arts and Sciences',
  'Connelly Center',
  'Corr Hall',
  'Davis Center for Athletics and Fitness',
  'Delurey Hall',
  'Dixon Center',
  'Dobbin Hall',
  'Donahue Hall',
  'Dougherty Hall',
  'Driscoll Hall',
  'Drosdick Hall (CEER)',
  'Facilities Management Building',
  'Falvey Memorial Library',
  'Faris Structural Engineering Teaching and Research Laboratory',
  'Farley Hall',
  'Farrell Hall',
  'Fedigan Hall',
  'Finneran Pavilion',
  'Francesca Hall',
  'Friar Hall',
  'Galberry Hall',
  'Gallagher Hall',
  'Gallen Hall',
  'Garey Hall',
  'Geraghty Hall',
  'Good Counsel Hall',
  'Griffin Hall',
  'Health Services Building',
  'Hovnanian Hall',
  'Inn at Villanova',
  'Ithan Garage',
  'Jackson Hall',
  'Jake Nevin Field House',
  'John Barry Hall',
  'Josephine Hall',
  'Katharine Hall',
  'Kennedy Hall (Aldwyn One)',
  'Kintsuba Hall (TSB)',
  'Law School Garage',
  'Lecceto Hall',
  'McGuinn Hall',
  'McGuire Hall',
  'Media Library',
  'Mendel Science Center',
  'Middleton Hall',
  'Military Sciences Building',
  'Montefalco Hall',
  'Moriarty Hall',
  'Moulden Hall',
  'Mullen Center',
  'Nicholas Hall',
  "O'Dwyer Hall",
  'Off Campus',
  'Old Falvey',
  'Ortiz Hall',
  'Picotte Hall at Dundale',
  'Riley Hall',
  'Rosseter Hall',
  'Rudolph Hall',
  'Sheehan Hall',
  'Simpson Hall',
  'St. Augustine Center for the Liberal Arts',
  'St. Clare Hall',
  "St. Mary's Hall",
  'St. Monica Hall',
  "St. Rita's Hall",
  'St. Thomas of Villanova Church',
  'St. Thomas of Villanova Monastery',
  'Stanford Hall',
  'Stanton Hall',
  'Steam Plant',
  'Stone Hall',
  'Sullivan Hall',
  'Thomas Hall',
  'Tolentine Hall',
  'Trinity Hall',
  'Vasey Hall',
  'Vic Maggitti Hall',
  'Villanova Center (789 Lancaster Ave)',
  'Villanova Stadium',
  'Welsh Hall',
  'White Hall',
  'Xavier Hall',
];

const Scanner = () => {
  const [manufacturer, setManufacturer] = useState('');
  const [location, setLocation] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [productModel, setProductModel] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [mac1, setMac1] = useState('');
  const [mac2, setMac2] = useState('');
  const [records, setRecords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [lastRoomNumber, setLastRoomNumber] = useState('');
  const fileInputRef = useRef(null);
  const exportFileInputRef = useRef(null);

  const productModelRef = useRef(null);
  const partNumberRef = useRef(null);
  const serialNumberRef = useRef(null);
  const mac1Ref = useRef(null);
  const mac2Ref = useRef(null);

  // Load records from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('scannerRecords');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
    const savedRoom = localStorage.getItem('lastRoomNumber');
    if (savedRoom) {
      setLastRoomNumber(savedRoom);
      setRoomNumber(savedRoom);
    }
  }, []);

  // Save records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scannerRecords', JSON.stringify(records));
  }, [records]);

  // Save last room number to localStorage
  useEffect(() => {
    localStorage.setItem('lastRoomNumber', lastRoomNumber);
  }, [lastRoomNumber]);

  const handleKeyDown = (e, nextRef, isLast = false) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isLast) {
        saveRecord();
      } else if (nextRef?.current) {
        nextRef.current.focus();
      }
    }
  };

  const saveRecord = () => {
    if (!productModel.trim()) {
      alert('Please scan at least the Product Model before saving.');
      productModelRef.current?.focus();
      return;
    }

    const newRecord = {
      id: '', // Leave empty as requested
      status: '',
      name: '',
      manufacturer,
      productModel: productModel.trim(),
      partNumber: partNumber.trim(),
      serialNumber: serialNumber.trim(),
      supplier: '',
      location,
      room: roomNumber.trim(),
      owningAcctDept: 'UTS Classroom Technology',
      owner: '',
      requestor: '',
      externalId: '',
      purchaseCost: '',
      acquired: '',
      installationDate: '',
      expectedReplacement: '',
      warrantyStart: '',
      warrantyEnd: '',
      warrantyDescription: '',
      macAddresses: [mac1.trim(), mac2.trim()].filter(Boolean).join(', '),
      ipAddresses: '',
      dnsNames: '',
      timestamp: new Date().toISOString(),
    };

    if (editingIndex !== null) {
      // Update existing record
      setRecords((prev) => prev.map((r, i) => (i === editingIndex ? newRecord : r)));
      setEditingIndex(null);
    } else {
      // Add new record
      setRecords((prev) => [...prev, newRecord]);
    }

    // Save room number for next scan
    setLastRoomNumber(roomNumber.trim());

    // Clear only barcode fields, keep dropdowns and room number
    setProductModel('');
    setPartNumber('');
    setSerialNumber('');
    setMac1('');
    setMac2('');

    // Focus back to first scan field
    productModelRef.current?.focus();
  };

  const editRecord = (index) => {
    const record = records[index];
    setManufacturer(record.manufacturer);
    setLocation(record.location);
    setRoomNumber(record.room);
    setProductModel(record.productModel);
    setPartNumber(record.partNumber);
    setSerialNumber(record.serialNumber);
    const macs = record.macAddresses ? record.macAddresses.split(', ') : [];
    setMac1(macs[0] || '');
    setMac2(macs[1] || '');
    setEditingIndex(index);
    productModelRef.current?.focus();
  };

  const resetFields = () => {
    setProductModel('');
    setPartNumber('');
    setSerialNumber('');
    setMac1('');
    setMac2('');
    // Keep room number when resetting
    setEditingIndex(null);
    productModelRef.current?.focus();
  };

  const deleteRecord = (index) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const clearAllRecords = () => {
    if (records.length === 0) return;
    if (window.confirm('Are you sure you want to delete ALL records?')) {
      setRecords([]);
    }
  };

  const importFromExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedRecords = jsonData.map((row) => ({
          id: row['ID'] || '',
          status: row['Status'] || '',
          name: row['Name'] || '',
          manufacturer: row['Manufacturer'] || '',
          productModel: row['Product Model'] || '',
          partNumber: row['Part Number'] || '',
          serialNumber: row['Serial Number'] || '',
          supplier: row['Supplier'] || '',
          location: row['Location'] || '',
          room: row['Room'] || '',
          owningAcctDept: row['Owning Acct/Dept'] || 'UTS Classroom Technology',
          owner: row['Owner'] || '',
          requestor: row['Requestor'] || '',
          externalId: row['External ID'] || '',
          purchaseCost: row['Purchase Cost'] || '',
          acquired: row['Acquired'] || '',
          installationDate: row['Installation Date'] || '',
          expectedReplacement: row['Expected Replacement'] || '',
          warrantyStart: row['Warranty Start'] || '',
          warrantyEnd: row['Warranty End'] || '',
          warrantyDescription: row['Warranty Description'] || '',
          macAddresses: row['MAC Addresses'] || '',
          ipAddresses: row['IP Addresses'] || '',
          dnsNames: row['DNS Names'] || '',
          timestamp: new Date().toISOString(),
        }));

        setRecords((prev) => [...prev, ...importedRecords]);
        alert(`Imported ${importedRecords.length} records successfully!`);
      } catch (error) {
        alert('Error reading file. Please make sure it\'s a valid Excel file with the correct format.');
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const mergeAndExport = (existingFile = null) => {
    if (records.length === 0) {
      alert('No records to export.');
      return;
    }

    let allRecords = [...records];

    // If an existing file was provided, merge it
    if (existingFile) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const existingData = XLSX.utils.sheet_to_json(worksheet);

          const existingRecords = existingData.map((row) => ({
            id: row['ID'] || '',
            status: row['Status'] || '',
            name: row['Name'] || '',
            manufacturer: row['Manufacturer'] || '',
            productModel: row['Product Model'] || '',
            partNumber: row['Part Number'] || '',
            serialNumber: row['Serial Number'] || '',
            supplier: row['Supplier'] || '',
            location: row['Location'] || '',
            room: row['Room'] || '',
            owningAcctDept: row['Owning Acct/Dept'] || 'UTS Classroom Technology',
            owner: row['Owner'] || '',
            requestor: row['Requestor'] || '',
            externalId: row['External ID'] || '',
            purchaseCost: row['Purchase Cost'] || '',
            acquired: row['Acquired'] || '',
            installationDate: row['Installation Date'] || '',
            expectedReplacement: row['Expected Replacement'] || '',
            warrantyStart: row['Warranty Start'] || '',
            warrantyEnd: row['Warranty End'] || '',
            warrantyDescription: row['Warranty Description'] || '',
            macAddresses: row['MAC Addresses'] || '',
            ipAddresses: row['IP Addresses'] || '',
            dnsNames: row['DNS Names'] || '',
          }));

          // Merge: existing records first, then new records
          allRecords = [...existingRecords, ...records];
          performExport(allRecords);
        } catch (error) {
          alert('Error reading existing file. Exporting new records only.');
          performExport(records);
        }
      };
      reader.readAsArrayBuffer(existingFile);
    } else {
      performExport(allRecords);
    }
  };

  const performExport = (recordsToExport) => {
    const excelData = recordsToExport.map((record) => ({
      ID: record.id,
      Status: record.status,
      Name: record.name,
      Manufacturer: record.manufacturer,
      'Product Model': record.productModel,
      'Part Number': record.partNumber,
      'Serial Number': record.serialNumber,
      Supplier: record.supplier,
      Location: record.location,
      Room: record.room,
      'Owning Acct/Dept': record.owningAcctDept,
      Owner: record.owner,
      Requestor: record.requestor,
      'External ID': record.externalId,
      'Purchase Cost': record.purchaseCost,
      Acquired: record.acquired,
      'Installation Date': record.installationDate,
      'Expected Replacement': record.expectedReplacement,
      'Warranty Start': record.warrantyStart,
      'Warranty End': record.warrantyEnd,
      'Warranty Description': record.warrantyDescription,
      'MAC Addresses': record.macAddresses,
      'IP Addresses': record.ipAddresses,
      'DNS Names': record.dnsNames,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws['!cols'] = [
      { wch: 10 }, // ID
      { wch: 10 }, // Status
      { wch: 15 }, // Name
      { wch: 12 }, // Manufacturer
      { wch: 15 }, // Product Model
      { wch: 15 }, // Part Number
      { wch: 18 }, // Serial Number
      { wch: 12 }, // Supplier
      { wch: 25 }, // Location
      { wch: 8 }, // Room
      { wch: 22 }, // Owning Acct/Dept
      { wch: 12 }, // Owner
      { wch: 12 }, // Requestor
      { wch: 12 }, // External ID
      { wch: 12 }, // Purchase Cost
      { wch: 12 }, // Acquired
      { wch: 15 }, // Installation Date
      { wch: 18 }, // Expected Replacement
      { wch: 14 }, // Warranty Start
      { wch: 14 }, // Warranty End
      { wch: 20 }, // Warranty Description
      { wch: 18 }, // MAC Addresses
      { wch: 15 }, // IP Addresses
      { wch: 15 }, // DNS Names
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'UTS - Classroom Technologies A');

    // Generate filename based on location and room
    let filename = 'UTS_Classroom_Assets';
    if (location) {
      const locationShort = location.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
      filename = locationShort;
      if (lastRoomNumber) {
        filename += `_Room_${lastRoomNumber}`;
      }
    }
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    filename += `_${dateStr}.xlsx`;

    XLSX.writeFile(wb, filename);
  };

  const exportToExcel = () => {
    mergeAndExport(null);
  };

  const handleMergeExport = (e) => {
    const file = e.target.files[0];
    if (file) {
      mergeAndExport(file);
    }
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-emerald-400 mb-8">
          UTS Asset Scanner
        </h1>

        {/* Scan Form Section */}
        <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 mb-8 border border-emerald-500/30">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
            <p className="text-amber-400 text-sm">
              Select Manufacturer and Location (they persist). Enter Room Number once - it auto-fills for next scans.
              Press Enter after each scan to move to the next field.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-emerald-400 mb-6">Scan Entry</h2>

          {/* Dropdowns Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-slate-900 rounded-full text-xs font-bold mr-2">
                  1
                </span>
                Manufacturer
              </label>
              <select
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full p-3 bg-slate-900/50 border-2 border-emerald-500/30 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-all"
              >
                <option value="">-- Select Manufacturer --</option>
                {MANUFACTURERS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-slate-900 rounded-full text-xs font-bold mr-2">
                  2
                </span>
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 bg-slate-900/50 border-2 border-emerald-500/30 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-all"
              >
                <option value="">-- Select Location --</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Room Number */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-slate-900 rounded-full text-xs font-bold mr-2">
                3
              </span>
              Room Number (optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g., 019"
                className="w-full p-3 pr-10 bg-slate-900/50 border-2 border-emerald-500/30 rounded-lg text-white font-mono focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 focus:outline-none transition-all"
              />
              {roomNumber && (
                <button
                  type="button"
                  onClick={() => setRoomNumber('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  X
                </button>
              )}
            </div>
          </div>

          {/* Barcode Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-slate-900 rounded-full text-xs font-bold mr-2">
                  4
                </span>
                Product Model (scan)
              </label>
              <div className="relative">
                <input
                  ref={productModelRef}
                  type="text"
                  value={productModel}
                  onChange={(e) => setProductModel(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, partNumberRef)}
                  placeholder="Scan product model barcode..."
                  className={`w-full p-4 pr-10 bg-slate-900/50 border-2 rounded-lg text-white font-mono text-lg focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 focus:outline-none transition-all ${
                    productModel ? 'border-emerald-500 bg-emerald-500/10' : 'border-emerald-500/30'
                  }`}
                  autoFocus
                />
                {productModel && (
                  <button
                    type="button"
                    onClick={() => { setProductModel(''); productModelRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    X
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-slate-900 rounded-full text-xs font-bold mr-2">
                  5
                </span>
                Part Number (scan)
              </label>
              <div className="relative">
                <input
                  ref={partNumberRef}
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, serialNumberRef)}
                  placeholder="Scan part number barcode (optional)..."
                  className={`w-full p-4 pr-10 bg-slate-900/50 border-2 rounded-lg text-white font-mono text-lg focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 focus:outline-none transition-all ${
                    partNumber ? 'border-emerald-500 bg-emerald-500/10' : 'border-emerald-500/30'
                  }`}
                />
                {partNumber && (
                  <button
                    type="button"
                    onClick={() => { setPartNumber(''); partNumberRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    X
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-slate-900 rounded-full text-xs font-bold mr-2">
                  6
                </span>
                Serial Number (scan)
              </label>
              <div className="relative">
                <input
                  ref={serialNumberRef}
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, mac1Ref)}
                  placeholder="Scan serial number barcode..."
                  className={`w-full p-4 pr-10 bg-slate-900/50 border-2 rounded-lg text-white font-mono text-lg focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 focus:outline-none transition-all ${
                    serialNumber ? 'border-emerald-500 bg-emerald-500/10' : 'border-emerald-500/30'
                  }`}
                />
                {serialNumber && (
                  <button
                    type="button"
                    onClick={() => { setSerialNumber(''); serialNumberRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    X
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-slate-900 rounded-full text-xs font-bold mr-2">
                    7
                  </span>
                  MAC Address 1 (optional)
                </label>
                <div className="relative">
                  <input
                    ref={mac1Ref}
                    type="text"
                    value={mac1}
                    onChange={(e) => setMac1(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, mac2Ref)}
                    placeholder="Scan MAC address 1..."
                    className={`w-full p-4 pr-10 bg-slate-900/50 border-2 rounded-lg text-white font-mono text-lg focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 focus:outline-none transition-all ${
                      mac1 ? 'border-emerald-500 bg-emerald-500/10' : 'border-emerald-500/30'
                    }`}
                  />
                  {mac1 && (
                    <button
                      type="button"
                      onClick={() => { setMac1(''); mac1Ref.current?.focus(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-slate-900 rounded-full text-xs font-bold mr-2">
                    8
                  </span>
                  MAC Address 2 (optional)
                </label>
                <div className="relative">
                  <input
                    ref={mac2Ref}
                    type="text"
                    value={mac2}
                    onChange={(e) => setMac2(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, null, true)}
                    placeholder="Scan MAC address 2..."
                    className={`w-full p-4 pr-10 bg-slate-900/50 border-2 rounded-lg text-white font-mono text-lg focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 focus:outline-none transition-all ${
                      mac2 ? 'border-emerald-500 bg-emerald-500/10' : 'border-emerald-500/30'
                    }`}
                  />
                  {mac2 && (
                    <button
                      type="button"
                      onClick={() => { setMac2(''); mac2Ref.current?.focus(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={saveRecord}
              className="flex-1 py-4 px-6 bg-emerald-500 text-slate-900 font-bold rounded-lg hover:bg-emerald-400 transition-all hover:-translate-y-0.5"
            >
              {editingIndex !== null ? 'Update Record' : 'Save Record'}
            </button>
            {editingIndex !== null && (
              <button
                onClick={resetFields}
                className="py-4 px-6 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* Records Section */}
        <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-emerald-500/30">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-emerald-400">Saved Records</h2>
            <span className="bg-emerald-500 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
              {records.length} record{records.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={importFromExcel}
              accept=".xlsx,.xls"
              className="hidden"
            />
            <input
              type="file"
              ref={exportFileInputRef}
              onChange={handleMergeExport}
              accept=".xlsx,.xls"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-3 px-6 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-all"
            >
              Import Excel
            </button>
            <button
              onClick={exportToExcel}
              disabled={records.length === 0}
              className="flex-1 py-3 px-6 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Export New
            </button>
            <button
              onClick={() => exportFileInputRef.current?.click()}
              disabled={records.length === 0}
              className="py-3 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Merge & Export
            </button>
            <button
              onClick={clearAllRecords}
              className="py-3 px-6 bg-red-500 text-white font-bold rounded-lg hover:bg-red-400 transition-all"
            >
              Clear All
            </button>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto rounded-lg">
            {records.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No records yet. Start scanning!</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-500/20">
                    <th className="p-3 text-left text-emerald-400 font-semibold">#</th>
                    <th className="p-3 text-left text-emerald-400 font-semibold">Manufacturer</th>
                    <th className="p-3 text-left text-emerald-400 font-semibold">Product Model</th>
                    <th className="p-3 text-left text-emerald-400 font-semibold">Part Number</th>
                    <th className="p-3 text-left text-emerald-400 font-semibold">Serial Number</th>
                    <th className="p-3 text-left text-emerald-400 font-semibold">MAC Addresses</th>
                    <th className="p-3 text-left text-emerald-400 font-semibold">Location</th>
                    <th className="p-3 text-left text-emerald-400 font-semibold">Room</th>
                    <th className="p-3 text-left text-emerald-400 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index} className="border-b border-slate-700 hover:bg-emerald-500/5">
                      <td className="p-3 text-gray-300">{index + 1}</td>
                      <td className="p-3 text-gray-300 font-mono">{record.manufacturer}</td>
                      <td className="p-3 text-gray-300 font-mono">{record.productModel}</td>
                      <td className="p-3 text-gray-300 font-mono">{record.partNumber}</td>
                      <td className="p-3 text-gray-300 font-mono">{record.serialNumber}</td>
                      <td className="p-3 text-gray-300 font-mono text-xs">{record.macAddresses}</td>
                      <td className="p-3 text-gray-300">{record.location}</td>
                      <td className="p-3 text-gray-300">{record.room}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editRecord(index)}
                            className="px-3 py-1 bg-amber-500 text-slate-900 text-xs rounded hover:bg-amber-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteRecord(index)}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t-2 border-emerald-500 p-3 text-center">
          <span className="text-gray-400">
            Owning: <span className="text-emerald-400 font-semibold">UTS Classroom Technology</span>
            {manufacturer && (
              <>
                {' '}
                | Manufacturer: <span className="text-emerald-400 font-semibold">{manufacturer}</span>
              </>
            )}
            {location && (
              <>
                {' '}
                | Location: <span className="text-emerald-400 font-semibold">{location}</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
