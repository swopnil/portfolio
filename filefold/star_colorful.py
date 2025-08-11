#!/usr/bin/env python3
"""
Colorful Video Enhancer - Maximum color vibrancy and quality
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

class ColorfulVideoEnhancer:
    def __init__(self, target_width=1920, target_height=1080, target_fps=24):
        self.target_width = target_width
        self.target_height = target_height
        self.target_fps = target_fps
        
        # Setup enhancement kernels
        self.sharpen_kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]]) * 0.15
        
    def super_vibrant_colors(self, frame):
        """Apply maximum color vibrancy"""
        # Convert to HSV for color manipulation
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)
        
        # Dramatically increase saturation
        s_float = s.astype(np.float32)
        s_enhanced = np.clip(s_float * 2.0, 0, 255)  # Double saturation
        
        # Boost brightness selectively
        v_float = v.astype(np.float32)
        v_enhanced = np.clip(v_float * 1.15, 0, 255)  # 15% brighter
        
        # Recombine
        hsv_enhanced = cv2.merge([h, s_enhanced.astype(np.uint8), v_enhanced.astype(np.uint8)])
        result = cv2.cvtColor(hsv_enhanced, cv2.COLOR_HSV2BGR)
        
        # Additional color boost in LAB space
        lab = cv2.cvtColor(result, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        
        # Boost A and B channels for more vivid colors
        a_enhanced = np.clip(a.astype(np.float32) * 1.3, 0, 255).astype(np.uint8)
        b_enhanced = np.clip(b.astype(np.float32) * 1.3, 0, 255).astype(np.uint8)
        
        lab_enhanced = cv2.merge([l, a_enhanced, b_enhanced])
        final_result = cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)
        
        return final_result
    
    def enhance_frame(self, frame):
        """Powerful frame enhancement with maximum colors"""
        try:
            # Resize frame if needed
            if frame.shape[1] != self.target_width or frame.shape[0] != self.target_height:
                frame = cv2.resize(frame, (self.target_width, self.target_height), interpolation=cv2.INTER_LANCZOS4)
            
            # Apply super vibrant colors first
            enhanced = self.super_vibrant_colors(frame)
            
            # Advanced contrast enhancement
            lab = cv2.cvtColor(enhanced, cv2.COLOR_BGR2LAB)
            l, a, b = cv2.split(lab)
            
            # CLAHE for better contrast
            clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
            l_enhanced = clahe.apply(l)
            
            enhanced = cv2.cvtColor(cv2.merge([l_enhanced, a, b]), cv2.COLOR_LAB2BGR)
            
            # Apply sharpening
            enhanced = cv2.filter2D(enhanced, -1, self.sharpen_kernel)
            
            # Advanced denoising while preserving colors
            enhanced = cv2.bilateralFilter(enhanced, 9, 80, 80)
            
            # Final color pop
            enhanced = cv2.addWeighted(enhanced, 1.2, enhanced, -0.2, 0)
            enhanced = np.clip(enhanced, 0, 255).astype(np.uint8)
            
            return enhanced
        except Exception as e:
            logger.error(f"Frame enhancement failed: {e}")
            return frame
    
    def process_video(self, input_path, output_path):
        """Process video with maximum colorful enhancement"""
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
        temp_output = "temp_colorful.mp4"
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(temp_output, fourcc, self.target_fps, (self.target_width, self.target_height))
        
        # Process frames with progress bar
        with tqdm(total=total_frames, desc="🌈 Enhancing colors") as pbar:
            frame_count = 0
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Skip some frames if we want to speed up
                frame_count += 1
                
                enhanced_frame = self.enhance_frame(frame)
                out.write(enhanced_frame)
                pbar.update(1)
        
        cap.release()
        out.release()
        
        # Re-encode with FFmpeg for maximum quality
        logger.info("🎞️ Final encoding with maximum quality...")
        cmd = [
            'ffmpeg', '-y', '-i', temp_output,
            '-c:v', 'libx264', '-preset', 'medium', '-crf', '15',  # Higher quality
            '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709',
            '-color_trc', 'bt709', '-colorspace', 'bt709',
            '-movflags', '+faststart',
            '-metadata', 'title=Super Colorful Enhanced Video',
            str(output_path)
        ]
        
        try:
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            os.remove(temp_output)
            
            # Get final stats
            output_size = Path(output_path).stat().st_size / (1024 * 1024)
            logger.info(f"✅ Complete! Output: {output_path} ({output_size:.1f} MB)")
            logger.info(f"🌈 Super vibrant colors applied with maximum enhancement!")
            
        except subprocess.CalledProcessError as e:
            logger.error(f"FFmpeg failed: {e}")
            logger.error(f"FFmpeg stderr: {e.stderr}")
            # Fallback - keep temp file
            if os.path.exists(temp_output):
                os.rename(temp_output, output_path)
                logger.info(f"✅ Complete (fallback): {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Super Colorful Video Enhancer")
    parser.add_argument("input", help="Input video file")
    parser.add_argument("-o", "--output", default="enhanced_super_colorful.mp4", help="Output file")
    parser.add_argument("--width", type=int, default=1920, help="Target width")
    parser.add_argument("--height", type=int, default=1080, help="Target height")
    parser.add_argument("--fps", type=int, default=24, help="Target FPS")
    
    if len(sys.argv) == 1:
        # Simple mode
        input_file = "input_video.mp4"
        output_file = "enhanced_super_colorful.mp4"
        enhancer = ColorfulVideoEnhancer()
    else:
        args = parser.parse_args()
        input_file = args.input
        output_file = args.output
        enhancer = ColorfulVideoEnhancer(args.width, args.height, args.fps)
    
    try:
        print("🌈🚀 SUPER COLORFUL VIDEO ENHANCER 🚀🌈")
        print("=" * 60)
        print("🎨 Maximum color vibrancy and quality enhancement")
        print("🔥 Preparing to make your video SUPER colorful!")
        print("=" * 60)
        
        enhancer.process_video(input_file, output_file)
        
        print("\n" + "=" * 60)
        print("🎉 SUCCESS! Your video is now SUPER COLORFUL! 🎉")
        print("=" * 60)
        print(f"🌈 Enhanced video: {output_file}")
        print("🎨 Applied: Maximum saturation, vibrant colors, sharp details")
        print("✨ Your video now has cinematic color grading!")
        
    except Exception as e:
        logger.error(f"Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()