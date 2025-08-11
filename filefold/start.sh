#!/bin/bash

# Mac M4 Pro Video Enhancement Setup Script
echo "🚀 Setting up AI Video Enhancement on Mac M4 Pro..."
source as/bin/activate
# Install Homebrew if not installed
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install FFmpeg with all codecs
echo "📹 Installing FFmpeg..."
brew install ffmpeg

# Install Python if not installed
echo "🐍 Installing Python..."
brew install python@3.11

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv video_enhancer_env
source video_enhancer_env/bin/activate

# Install PyTorch with Apple Silicon support
echo "🧠 Installing PyTorch for Apple Silicon..."
pip install torch torchvision torchaudio

# Install OpenCV optimized for Apple Silicon
echo "👁️ Installing OpenCV..."
pip install opencv-python

# Install additional dependencies
echo "📚 Installing additional packages..."
pip install numpy pillow tqdm requests

# Install Real-ESRGAN
echo "🎨 Installing Real-ESRGAN..."
pip install realesrgan
pip install basicsr
pip install facexlib
pip install gfpgan

# Download Real-ESRGAN models
echo "📥 Downloading AI models..."
mkdir -p models
cd models

# Download Real-ESRGAN x4 model
wget -O RealESRGAN_x4plus.pth https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth

# Download Real-ESRGAN x2 model
wget -O RealESRGAN_x2plus.pth https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x2plus.pth

cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 To use the video enhancer:"
echo "1. Activate the environment: source video_enhancer_env/bin/activate"
echo "2. Place your video file in the same directory"
echo "3. Run: python ai_video_enhancer.py"
echo ""
echo "💡 Your Mac M4 Pro will use MPS (Metal Performance Shaders) for GPU acceleration!"