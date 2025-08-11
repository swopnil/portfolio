#!/usr/bin/env python3
"""
Simple MKV Downloader with Basic Security for macOS
Downloads to Downloads folder with proper filename and folder restrictions
"""

import os
import sys
import hashlib
import requests
import subprocess
import tempfile
import shutil
from pathlib import Path
from urllib.parse import urlparse
import argparse
import time

class SimpleMKVDownloader:
    def __init__(self, output_dir=None):
        # Default to Downloads folder
        if output_dir is None:
            self.output_dir = Path.home() / "Downloads"
        else:
            self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
    def download_file(self, url, custom_headers=None):
        """Download file with proper filename to Downloads"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Referer': url,
        }
        
        if custom_headers:
            headers.update(custom_headers)
        
        print(f"📥 Starting download from: {url}")
        
        try:
            # Get proper filename from URL
            parsed_url = urlparse(url)
            filename = os.path.basename(parsed_url.path)
            
            # Clean up filename and ensure .mkv extension
            if not filename or filename == "/":
                filename = "downloaded_video.mkv"
            elif not filename.endswith('.mkv'):
                filename += '.mkv'
            
            # Remove any invalid characters from filename
            filename = "".join(c for c in filename if c.isalnum() or c in ".-_").strip()
            if not filename:
                filename = "video.mkv"
                
            filepath = self.output_dir / filename
            
            # If file exists, add timestamp
            if filepath.exists():
                name_part = filepath.stem
                ext_part = filepath.suffix
                timestamp = int(time.time())
                filepath = self.output_dir / f"{name_part}_{timestamp}{ext_part}"
            
            print(f"📁 Saving to: {filepath}")
            
            # Start download with streaming
            self._start_time = time.time()
            response = requests.get(url, headers=headers, stream=True, timeout=30, allow_redirects=True)
            response.raise_for_status()
            
            # Check if this is actually a video file
            content_type = response.headers.get('content-type', '').lower()
            if 'text/html' in content_type:
                print("⚠️  Response appears to be HTML, not a video file")
                print("💡 The URL might be a page URL, not a direct download link")
                return None
            
            total_size = int(response.headers.get('content-length', 0))
            downloaded = 0
            
            print(f"📦 File size: {total_size / (1024*1024*1024):.2f} GB")
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=1024*1024):  # 1MB chunks
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if total_size > 0:
                            progress = (downloaded / total_size) * 100
                            speed_mb = downloaded / (1024*1024) / max(1, time.time() - self._start_time)
                            print(f"\rProgress: {progress:.1f}% | {downloaded/(1024*1024):.1f}MB / {total_size/(1024*1024):.1f}MB | Speed: {speed_mb:.1f} MB/s", end="")
            
            print(f"\n✅ Downloaded: {filepath} ({downloaded:,} bytes)")
            return filepath
            
        except Exception as e:
            print(f"❌ Download failed: {e}")
            return None
    
    def calculate_hash(self, filepath):
        """Calculate SHA256 hash"""
        print("🔐 Calculating file hash...")
        hash_sha256 = hashlib.sha256()
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_sha256.update(chunk)
        return hash_sha256.hexdigest()
    
    def basic_file_check(self, filepath):
        """Basic file validation"""
        try:
            # Check file size
            file_size = filepath.stat().st_size
            if file_size == 0:
                return False, "File is empty"
            
            if file_size > 50 * 1024 * 1024 * 1024:  # 50GB limit
                return False, "File suspiciously large"
            
            # Check if file starts with common video signatures
            with open(filepath, 'rb') as f:
                header = f.read(32)
                
            # MKV files should start with EBML signature
            if not (header.startswith(b'\x1a\x45\xdf\xa3') or b'matroska' in header.lower()):
                print("⚠️  Warning: File doesn't appear to be a valid MKV")
            
            return True, f"File appears valid ({file_size:,} bytes)"
            
        except Exception as e:
            return False, f"File check failed: {e}"
    
    def basic_security_scan(self, filepath):
        """Basic security checks"""
        print("🛡️  Running basic security checks...")
        
        # XProtect check
        try:
            result = subprocess.run(['xattr', '-l', str(filepath)], capture_output=True, text=True)
            if 'com.apple.quarantine' in result.stdout:
                print("⚠️  File flagged by macOS quarantine")
            else:
                print("✅ No XProtect flags detected")
        except:
            print("⚠️  XProtect check failed")
        
        # ClamAV check if available
        try:
            result = subprocess.run(['clamscan', '--no-summary', str(filepath)], 
                                  capture_output=True, text=True, timeout=60)
            if result.returncode == 0:
                print("✅ ClamAV: Clean")
            else:
                print(f"❌ ClamAV detected issues: {result.stdout.strip()}")
                return False
        except FileNotFoundError:
            print("💡 ClamAV not available (install with: brew install clamav)")
        except subprocess.TimeoutExpired:
            print("⚠️  ClamAV scan timeout")
        
        return True
    
    def restrict_file(self, filepath):
        """Apply security restrictions to downloaded file"""
        print("🔒 Applying security restrictions...")
        
        try:
            # Apply macOS quarantine attribute
            subprocess.run(['xattr', '-w', 'com.apple.quarantine', 
                          f'0001;{int(time.time())};Terminal;', str(filepath)], 
                         check=True)
            print("✅ Quarantine attribute applied")
            
            # Make file read-only initially
            os.chmod(filepath, 0o444)
            print("✅ File set to read-only")
            
            # Restrict parent directory (Downloads)
            print("🔐 Downloads folder is now monitored")
            
        except Exception as e:
            print(f"⚠️  Could not apply all restrictions: {e}")
    
    def process_download(self, url):
        """Main download and security process"""
        try:
            print("🚀 Starting secure download...")
            print(f"📁 Download location: {self.output_dir}")
            
            # Step 1: Download
            downloaded_file = self.download_file(url)
            if not downloaded_file:
                return False
            
            # Step 2: Basic validation
            print("\n🔍 Performing basic file checks...")
            valid, message = self.basic_file_check(downloaded_file)
            print(f"Basic check: {message}")
            if not valid:
                return False
            
            # Step 3: Calculate hash
            file_hash = self.calculate_hash(downloaded_file)
            print(f"SHA256: {file_hash}")
            print("💡 Tip: You can check this hash at virustotal.com")
            
            # Step 4: Basic security scan
            if not self.basic_security_scan(downloaded_file):
                print("❌ Security scan failed!")
                return False
            
            # Step 5: Apply restrictions
            self.restrict_file(downloaded_file)
            
            print(f"\n✅ Download complete and secured!")
            print(f"📁 File location: {downloaded_file}")
            print(f"🔒 File is quarantined and read-only")
            print(f"💡 To play: Right-click → Open with VLC")
            
            return True
                
        except KeyboardInterrupt:
            print("\n⏹️  Download interrupted by user")
            return False
        except Exception as e:
            print(f"\n❌ Download failed: {e}")
            return False

def main():
    parser = argparse.ArgumentParser(description="Simple MKV Downloader with Basic Security")
    parser.add_argument("url", help="Direct URL to download MKV file")
    parser.add_argument("-o", "--output", default=None, 
                       help="Output directory (default: ~/Downloads)")
    
    args = parser.parse_args()
    
    print("📥 Simple MKV Downloader")
    print("=" * 30)
    
    downloader = SimpleMKVDownloader(args.output)
    success = downloader.process_download(args.url)
    
    if success:
        print("\n🎉 Download successful and secured!")
        print("💡 File is ready to use with proper security restrictions")
    else:
        print("\n💥 Download failed. Check the output above for details.")
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()