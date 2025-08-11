#!/usr/bin/env python3
"""
Fast Video Enhancer - Optimized for quick processing
"""

import cv2
import numpy as np
import os
import sys
import subprocess
import logging
from pathlib import Path
from tqdm import tqdm
import argparse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FastVideoEnhancer:
    def __init__(self, target_width=1280, target_height=720, target_fps=24):
        self.target_width = target_width
        self.target_height = target_height
        self.target_fps = target_fps
        
        # Setup enhancement kernels
        self.sharpen_kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]]) * 0.1
        
    def enhance_frame(self, frame):
        """Quick frame enhancement"""
        try:
            # Resize frame
            if frame.shape[1] != self.target_width or frame.shape[0] != self.target_height:
                frame = cv2.resize(frame, (self.target_width, self.target_height), interpolation=cv2.INTER_LANCZOS4)
            
            # Apply light sharpening
            enhanced = cv2.filter2D(frame, -1, self.sharpen_kernel)
            
            # Light denoising
            enhanced = cv2.bilateralFilter(enhanced, 9, 75, 75)
            
            # Enhance contrast
            lab = cv2.cvtColor(enhanced, cv2.COLOR_BGR2LAB)
            l, a, b = cv2.split(lab)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            l = clahe.apply(l)
            enhanced = cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2BGR)
            
            return enhanced
        except:
            return frame
    
    def process_video(self, input_path, output_path):
        """Process video with direct FFmpeg pipeline"""
        logger.info(f"🎬 Processing: {input_path}")
        
        # Check input
        if not Path(input_path).exists():
            raise FileNotFoundError(f"Input not found: {input_path}")
        
        # Get video info
        cap = cv2.VideoCapture(str(input_path))
        if not cap.isOpened():
            raise ValueError(f"Cannot open: {input_path}")
        
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        original_fps = cap.get(cv2.CAP_PROP_FPS)
        
        logger.info(f"📊 Input: {total_frames} frames @ {original_fps:.1f}fps")
        logger.info(f"📊 Output: {self.target_width}x{self.target_height} @ {self.target_fps}fps")
        
        # Create temporary output for processed frames
        temp_output = "temp_enhanced.mp4"
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(temp_output, fourcc, self.target_fps, (self.target_width, self.target_height))
        
        # Process frames
        with tqdm(total=total_frames, desc="Processing") as pbar:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                enhanced_frame = self.enhance_frame(frame)
                out.write(enhanced_frame)
                pbar.update(1)
        
        cap.release()
        out.release()
        
        # Re-encode with FFmpeg for better quality
        logger.info("🎞️ Final encoding...")
        cmd = [
            'ffmpeg', '-y', '-i', temp_output,
            '-c:v', 'libx264', '-preset', 'fast', '-crf', '20',
            '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
            str(output_path)
        ]
        
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            os.remove(temp_output)
            
            # Get final stats
            output_size = Path(output_path).stat().st_size / (1024 * 1024)
            logger.info(f"✅ Complete! Output: {output_path} ({output_size:.1f} MB)")
            
        except subprocess.CalledProcessError as e:
            logger.error(f"FFmpeg failed: {e}")
            # Fallback - keep temp file
            os.rename(temp_output, output_path)
            logger.info(f"✅ Complete (fallback): {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Fast Video Enhancer")
    parser.add_argument("input", help="Input video file")
    parser.add_argument("-o", "--output", default="enhanced_fast.mp4", help="Output file")
    parser.add_argument("--width", type=int, default=1280, help="Target width")
    parser.add_argument("--height", type=int, default=720, help="Target height")
    parser.add_argument("--fps", type=int, default=24, help="Target FPS")
    
    if len(sys.argv) == 1:
        # Simple mode
        input_file = "input_video.mp4"
        output_file = "enhanced_fast.mp4"
        enhancer = FastVideoEnhancer()
    else:
        args = parser.parse_args()
        input_file = args.input
        output_file = args.output
        enhancer = FastVideoEnhancer(args.width, args.height, args.fps)
    
    try:
        enhancer.process_video(input_file, output_file)
        print(f"🎉 Success! Enhanced video: {output_file}")
    except Exception as e:
        logger.error(f"Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()