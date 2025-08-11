import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, Download, Settings, Film, Sun, Eye, Palette, Sliders, Zap, Music, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const VideoEditor = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFilename, setUploadedFilename] = useState('');
    const [localFilePath, setLocalFilePath] = useState('');
    const [processingMode, setProcessingMode] = useState('upload'); // 'upload' or 'local'
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedVideoUrl, setProcessedVideoUrl] = useState('');
    const [videoInfo, setVideoInfo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Sidebar state  
    const [collapsedSections, setCollapsedSections] = useState({
        audio: true,
        visual: true, 
        effects: true,
        performance: true,
        output: true,
        presets: false // Keep presets open by default
    });
    
    // Live preview state
    const [previewUrl, setPreviewUrl] = useState('');
    const [livePreviewEnabled, setLivePreviewEnabled] = useState(false);
    const [framePreviewUrl, setFramePreviewUrl] = useState('');
    const [currentVideoTime, setCurrentVideoTime] = useState(0);
    
    // Video settings
    const [settings, setSettings] = useState({
        volume: 1,
        brightness: 0,
        contrast: 1,
        saturation: 1,
        blur: 0,
        sharpen: 0,
        noise_reduction: '',
        stabilization: false,
        speed: 1,
        format: 'mp4',
        filters: []
    });

    const videoRef = useRef(null);
    const fileInputRef = useRef(null);

    // Ensure scrolling is enabled when component mounts
    useEffect(() => {
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.height = 'auto';
        
        return () => {
            // Cleanup on unmount if needed
            document.body.style.overflow = '';
            document.body.style.height = '';
            document.documentElement.style.overflow = '';
            document.documentElement.style.height = '';
        };
    }, []);

    const presetFilters = [
        // Color Styles - Mutually Exclusive
        { id: 'vintage', name: 'Vintage', description: 'Classic film grain look', group: 'Color Style' },
        { id: 'black_white', name: 'Black & White', description: 'Monochrome effect', group: 'Color Style' },
        { id: 'sepia', name: 'Sepia', description: 'Warm brown tone', group: 'Color Style' },
        { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon blue/purple tint', group: 'Color Style' },
        { id: 'sunset', name: 'Sunset', description: 'Orange/pink warm glow', group: 'Color Style' },
        { id: 'noir', name: 'Film Noir', description: 'High contrast B&W', group: 'Color Style' },
        { id: 'pastel', name: 'Pastel', description: 'Soft, muted colors', group: 'Color Style' },
        { id: 'faded', name: 'Faded', description: 'Washed out, aged look', group: 'Color Style' },
        
        // Temperature - Mutually Exclusive
        { id: 'warm', name: 'Warm', description: 'Warmer color temperature', group: 'Temperature' },
        { id: 'cool', name: 'Cool', description: 'Cooler color temperature', group: 'Temperature' },
        { id: 'arctic', name: 'Arctic', description: 'Very cool, icy blue', group: 'Temperature' },
        { id: 'golden_hour', name: 'Golden Hour', description: 'Warm golden light', group: 'Temperature' },
        
        // Enhancement - Can be combined
        { id: 'enhance', name: 'Auto Enhance', description: 'Automatic enhancement', group: 'Enhancement' },
        { id: 'dramatic', name: 'Dramatic', description: 'High contrast dramatic look', group: 'Enhancement' },
        { id: 'vibrant', name: 'Vibrant', description: 'Boost color saturation', group: 'Enhancement' },
        { id: 'crisp', name: 'Crisp', description: 'Enhanced sharpness', group: 'Enhancement' },
        { id: 'soft', name: 'Soft', description: 'Dreamy, soft appearance', group: 'Enhancement' },
        { id: 'matte', name: 'Matte', description: 'Flat, desaturated look', group: 'Enhancement' },
        
        // Cinematic - Can be combined
        { id: 'blockbuster', name: 'Blockbuster', description: 'Hollywood movie look', group: 'Cinematic' },
        { id: 'indie', name: 'Indie Film', description: 'Independent film aesthetic', group: 'Cinematic' },
        { id: 'horror', name: 'Horror', description: 'Dark, eerie atmosphere', group: 'Cinematic' },
        { id: 'romantic', name: 'Romantic', description: 'Soft, warm romantic feel', group: 'Cinematic' },
        { id: 'action', name: 'Action', description: 'High energy, sharp contrast', group: 'Cinematic' },
        
        // Social Media - Mutually Exclusive
        { id: 'instagram', name: 'Instagram', description: 'Social media optimized', group: 'Social Media' },
        { id: 'tiktok', name: 'TikTok', description: 'Trendy, vibrant colors', group: 'Social Media' },
        { id: 'youtube', name: 'YouTube', description: 'Thumbnail-friendly look', group: 'Social Media' },
        
        // Retro/Vintage - Mutually Exclusive  
        { id: 'retro_80s', name: '80s Retro', description: 'Neon synthwave aesthetic', group: 'Retro' },
        { id: 'retro_90s', name: '90s Nostalgia', description: 'VHS tape look', group: 'Retro' },
        { id: 'polaroid', name: 'Polaroid', description: 'Instant photo effect', group: 'Retro' },
        { id: 'film_grain', name: 'Film Grain', description: 'Analog film texture', group: 'Retro' },
        
        // Projector Fix - Can be combined
        { id: 'projector_enhance', name: 'Projector Enhance', description: 'Overall projector recording fix', group: 'Projector Fix' },
        { id: 'keystone_correct', name: 'Keystone Correct', description: 'Fix trapezoidal distortion', group: 'Projector Fix' },
        { id: 'contrast_boost', name: 'Contrast Boost', description: 'Enhance washed out projector image', group: 'Projector Fix' },
        { id: 'color_recover', name: 'Color Recovery', description: 'Restore faded projector colors', group: 'Projector Fix' },
        { id: 'screen_flatten', name: 'Screen Flatten', description: 'Remove screen texture/wrinkles', group: 'Projector Fix' },
        { id: 'brightness_fix', name: 'Brightness Fix', description: 'Fix dim projector recording', group: 'Projector Fix' },
        { id: 'ambient_remove', name: 'Ambient Light Remove', description: 'Reduce ambient light washout', group: 'Projector Fix' },
        { id: 'focus_sharpen', name: 'Focus Sharpen', description: 'Fix blurry projector image', group: 'Projector Fix' },
        
        // Resolution - Mutually Exclusive
        { id: 'upscale_2x', name: 'Upscale 2x', description: 'Double resolution', group: 'Resolution' },
        { id: 'upscale_4x', name: 'Upscale 4x', description: 'Quadruple resolution', group: 'Resolution' }
    ];

    const formatOptions = [
        { value: 'mp4', label: 'MP4 (H.264)' },
        { value: 'webm', label: 'WebM' },
        { value: 'mov', label: 'MOV' },
        { value: 'avi', label: 'AVI' }
    ];

    const noiseReductionOptions = [
        { value: '', label: 'None' },
        { value: 'light', label: 'Light' },
        { value: 'medium', label: 'Medium' },
        { value: 'heavy', label: 'Heavy' }
    ];

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setProcessedVideoUrl('');
            setVideoInfo(null);
            
            // For local processing mode, we can get the file path
            if (processingMode === 'local' && file.path) {
                setLocalFilePath(file.path);
            }
        }
    };
    
    const handleLocalPathChange = (event) => {
        const path = event.target.value;
        setLocalFilePath(path);
        setProcessedVideoUrl('');
        setVideoInfo(null);
        
        // Get file info from local path
        if (path) {
            getLocalVideoInfo(path);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append('video', selectedFile);

        try {
            // Create XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();
            
            // Set up progress tracking
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = (event.loaded / event.total) * 100;
                    setUploadProgress(Math.round(progress));
                }
            };
            
            // Create promise wrapper for XMLHttpRequest
            const uploadPromise = new Promise((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error(xhr.statusText));
                    }
                };
                xhr.onerror = () => reject(new Error('Upload failed'));
                xhr.ontimeout = () => reject(new Error('Upload timeout'));
            });
            
            // Configure and send request
            xhr.open('POST', 'http://localhost:5001/api/upload');
            xhr.timeout = 30 * 60 * 1000; // 30 minute timeout for large files
            xhr.send(formData);
            
            const result = await uploadPromise;
            setUploadedFilename(result.filename);
            setPreviewUrl(`http://localhost:5001/uploads/${result.filename}`);
            getVideoInfo(result.filename);
            
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.message.includes('413') ? 
                'File too large. Maximum size is 15GB.' : 
                'Upload failed: ' + error.message;
            alert(errorMessage);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const getVideoInfo = async (filename) => {
        try {
            const response = await fetch('http://localhost:5001/api/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filename })
            });

            const info = await response.json();
            if (response.ok) {
                setVideoInfo(info);
            }
        } catch (error) {
            console.error('Failed to get video info:', error);
        }
    };
    
    const getLocalVideoInfo = async (filePath) => {
        try {
            const response = await fetch('http://localhost:5001/api/local-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filePath })
            });

            const info = await response.json();
            if (response.ok) {
                setVideoInfo(info);
                
                // Check if format is browser-compatible for preview
                const fileExtension = filePath.toLowerCase().split('.').pop();
                const browserCompatibleFormats = ['mp4', 'webm', 'ogg'];
                
                if (browserCompatibleFormats.includes(fileExtension)) {
                    // For browser-compatible formats, set the preview URL
                    setPreviewUrl(`file://${filePath}`);
                } else {
                    // For unsupported formats like MKV, don't set preview URL
                    // Live preview will still work through frame extraction
                    setPreviewUrl('');
                    console.log(`Format ${fileExtension} not supported for browser preview, but processing will work`);
                }
            } else {
                alert('Failed to get local file info: ' + info.error);
            }
        } catch (error) {
            console.error('Failed to get local video info:', error);
            alert('Failed to access local file: ' + error.message);
        }
    };

    const handleProcess = async () => {
        if (!uploadedFilename && !localFilePath) return;

        setIsProcessing(true);
        try {
            let response;
            
            if (processingMode === 'local' && localFilePath) {
                // Use local file processing endpoint
                response = await fetch('http://localhost:5001/api/process-local', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filePath: localFilePath,
                        ...settings
                    })
                });
            } else {
                // Use uploaded file processing endpoint
                response = await fetch('http://localhost:5001/api/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filename: uploadedFilename,
                        ...settings
                    })
                });
            }

            const result = await response.json();
            if (response.ok) {
                setProcessedVideoUrl(`http://localhost:5001${result.downloadUrl}`);
                alert('Video processed successfully!');
            } else {
                console.error('Processing failed:', result);
                alert('Processing failed: ' + result.error + '\nDetails: ' + (result.details || 'Unknown error'));
            }
        } catch (error) {
            console.error('Processing error:', error);
            alert('Processing failed: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSettingChange = (key, value) => {
        console.log('Setting changed:', key, '=', value, 'Live preview enabled:', livePreviewEnabled);
        
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
        
        // Trigger live frame preview update with debounce
        if (livePreviewEnabled && (uploadedFilename || localFilePath)) {
            console.log('Triggering frame preview update due to setting change');
            clearTimeout(window.framePreviewTimeout);
            window.framePreviewTimeout = setTimeout(() => {
                generateFramePreview();
            }, 300);
        }
    };

    const generateLivePreview = async () => {
        if (!uploadedFilename) return;

        try {
            const response = await fetch('http://localhost:5001/api/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: uploadedFilename,
                    ...settings,
                    duration: 5 // Preview first 5 seconds only
                })
            });

            const result = await response.json();
            if (response.ok) {
                setPreviewUrl(`http://localhost:5001${result.previewUrl}?t=${Date.now()}`);
            }
        } catch (error) {
            console.error('Live preview failed:', error);
        }
    };

    const generateFramePreview = async () => {
        await generateFramePreviewWithSettings(settings);
    };

    // Handle video time updates
    const handleVideoTimeUpdate = () => {
        if (videoRef.current) {
            const newTime = videoRef.current.currentTime;
            setCurrentVideoTime(newTime);
            
            // Trigger frame preview update if live preview is enabled
            if (livePreviewEnabled && (uploadedFilename || localFilePath)) {
                clearTimeout(window.videoTimeUpdateTimeout);
                window.videoTimeUpdateTimeout = setTimeout(() => {
                    generateFramePreview();
                }, 500); // Debounce video time updates
            }
        }
    };
    
    // Manual time control for unsupported formats
    const handleManualTimeChange = (newTime) => {
        setCurrentVideoTime(newTime);
        
        // Trigger frame preview update if live preview is enabled
        if (livePreviewEnabled && (uploadedFilename || localFilePath)) {
            clearTimeout(window.videoTimeUpdateTimeout);
            window.videoTimeUpdateTimeout = setTimeout(() => {
                generateFramePreview();
            }, 300);
        }
    };

    const handleFilterToggle = (filterId) => {
        console.log('Filter toggle:', filterId);
        
        setSettings(prev => {
            let newFilters = [...prev.filters];
            
            // Define mutually exclusive groups
            const colorStyle = ['vintage', 'black_white', 'sepia', 'cyberpunk', 'sunset', 'noir', 'pastel', 'faded'];
            const temperature = ['warm', 'cool', 'arctic', 'golden_hour'];
            const socialMedia = ['instagram', 'tiktok', 'youtube'];
            const retro = ['retro_80s', 'retro_90s', 'polaroid', 'film_grain'];
            const upscale = ['upscale_2x', 'upscale_4x'];
            
            const isCurrentlyActive = newFilters.includes(filterId);
            console.log('Filter', filterId, 'is currently active:', isCurrentlyActive);
            
            if (isCurrentlyActive) {
                // Remove the filter if it's currently active
                newFilters = newFilters.filter(f => f !== filterId);
                console.log('Removing filter, new filters:', newFilters);
            } else {
                // Add the filter, but remove conflicting ones first
                if (colorStyle.includes(filterId)) {
                    newFilters = newFilters.filter(f => !colorStyle.includes(f));
                }
                if (temperature.includes(filterId)) {
                    newFilters = newFilters.filter(f => !temperature.includes(f));
                }
                if (socialMedia.includes(filterId)) {
                    newFilters = newFilters.filter(f => !socialMedia.includes(f));
                }
                if (retro.includes(filterId)) {
                    newFilters = newFilters.filter(f => !retro.includes(f));
                }
                if (upscale.includes(filterId)) {
                    newFilters = newFilters.filter(f => !upscale.includes(f));
                }
                
                newFilters.push(filterId);
                console.log('Adding filter, new filters:', newFilters);
            }
            
            const newSettings = {
                ...prev,
                filters: newFilters
            };
            
            // Trigger live frame preview update after state change
            if (livePreviewEnabled && (uploadedFilename || localFilePath)) {
                console.log('Scheduling frame preview update due to filter change');
                clearTimeout(window.framePreviewTimeout);
                window.framePreviewTimeout = setTimeout(() => {
                    console.log('Executing delayed frame preview with filters:', newFilters);
                    // Call generateFramePreview with the new settings
                    generateFramePreviewWithSettings(newSettings);
                }, 100); // Reduced timeout for faster response
            }
            
            return newSettings;
        });
    };
    
    // Helper function to generate frame preview with specific settings
    const generateFramePreviewWithSettings = async (settingsToUse = settings) => {
        if (!uploadedFilename && !localFilePath) {
            console.log('No uploaded filename or local file path for frame preview');
            return;
        }

        console.log('Generating frame preview at time:', currentVideoTime, 'with settings:', settingsToUse);

        try {
            let response;
            
            if (processingMode === 'local' && localFilePath) {
                // Use local file frame preview endpoint
                response = await fetch('http://localhost:5001/api/local-frame-preview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filePath: localFilePath,
                        timestamp: currentVideoTime,
                        ...settingsToUse
                    })
                });
            } else {
                // Use uploaded file frame preview endpoint
                response = await fetch('http://localhost:5001/api/frame-preview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filename: uploadedFilename,
                        timestamp: currentVideoTime,
                        ...settingsToUse
                    })
                });
            }

            const result = await response.json();
            console.log('Frame preview response:', result);
            
            if (response.ok) {
                setFramePreviewUrl(`http://localhost:5001${result.frameUrl}?t=${Date.now()}`);
                console.log('Frame preview URL updated:', result.frameUrl);
            } else {
                console.error('Frame preview failed:', result);
            }
        } catch (error) {
            console.error('Frame preview failed:', error);
        }
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const resetSettings = () => {
        setSettings({
            volume: 1,
            brightness: 0,
            contrast: 1,
            saturation: 1,
            blur: 0,
            sharpen: 0,
            noise_reduction: '',
            stabilization: false,
            speed: 1,
            format: 'mp4',
            filters: []
        });
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleSection = (section) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const sidebarSections = [
        {
            id: 'audio',
            title: 'Audio Controls',
            icon: Music,
            color: 'purple'
        },
        {
            id: 'visual',
            title: 'Visual Enhancement', 
            icon: Sun,
            color: 'blue'
        },
        {
            id: 'effects',
            title: 'Effects & Filters',
            icon: Sparkles,
            color: 'pink'
        },
        {
            id: 'performance',
            title: 'Performance',
            icon: Zap,
            color: 'green'
        },
        {
            id: 'output',
            title: 'Output Settings',
            icon: Settings,
            color: 'orange'
        },
        {
            id: 'presets',
            title: 'Preset Filters',
            icon: Palette,
            color: 'indigo'
        }
    ];

    return (
        <div 
            className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" 
            style={{
                minHeight: '100vh',
                height: 'auto',
                overflow: 'visible'
            }}
        >
            <div className="max-w-7xl mx-auto p-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <Film className="text-purple-400" size={40} />
                        Pro Video Editor
                    </h1>
                    <p className="text-purple-200 text-lg">
                        Powerful video editing with AI-enhanced filters and professional tools
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 pb-20">
                    {/* Main Content */}
                    <div className="flex-1 space-y-6 lg:max-w-3xl">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <Upload size={20} />
                                    Video Source
                                </h2>
                                <div className="flex bg-purple-900/50 rounded-lg p-1">
                                    <button
                                        onClick={() => setProcessingMode('upload')}
                                        className={`px-3 py-1 rounded text-sm transition-colors ${
                                            processingMode === 'upload'
                                                ? 'bg-purple-600 text-white'
                                                : 'text-purple-200 hover:text-white'
                                        }`}
                                    >
                                        Upload File
                                    </button>
                                    <button
                                        onClick={() => setProcessingMode('local')}
                                        className={`px-3 py-1 rounded text-sm transition-colors ${
                                            processingMode === 'local'
                                                ? 'bg-purple-600 text-white'
                                                : 'text-purple-200 hover:text-white'
                                        }`}
                                    >
                                        Local Path
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {processingMode === 'upload' ? (
                                    <div 
                                        className="border-2 border-dashed border-purple-400 rounded-lg p-8 text-center cursor-pointer hover:border-purple-300 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="mx-auto mb-4 text-purple-400" size={48} />
                                        <p className="text-white text-lg mb-2">
                                            {selectedFile ? selectedFile.name : 'Click to select video file'}
                                        </p>
                                        {selectedFile && (
                                            <p className="text-purple-200 text-sm">
                                                Size: {formatBytes(selectedFile.size)}
                                            </p>
                                        )}
                                        <p className="text-purple-300 text-sm mt-2">
                                            Supports: MP4, AVI, MOV, MKV, WMV, FLV, WebM (Max: 15GB)
                                        </p>
                                        {selectedFile && selectedFile.size > 1024 * 1024 * 1024 && (
                                            <p className="text-yellow-300 text-sm mt-1 flex items-center gap-1">
                                                <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
                                                Large file detected - upload may take several minutes
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-green-400 rounded-lg p-8">
                                        <div className="flex items-center justify-center mb-4">
                                            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-white text-sm font-medium">
                                                Local Video File Path
                                            </label>
                                            <input
                                                type="text"
                                                value={localFilePath}
                                                onChange={handleLocalPathChange}
                                                placeholder="/path/to/your/video.mp4"
                                                className="w-full bg-black/30 text-white border border-green-400/50 rounded-lg px-4 py-3 focus:border-green-400 focus:outline-none transition-colors"
                                            />
                                            <p className="text-green-300 text-sm">
                                                📁 Enter the full path to your local video file
                                            </p>
                                            <p className="text-green-200 text-xs">
                                                ⚡ No upload needed - processes directly from your device!
                                            </p>
                                            {localFilePath && (
                                                <div className="mt-3 p-3 bg-green-900/20 rounded-lg">
                                                    <p className="text-green-100 text-sm break-all">
                                                        📁 {localFilePath}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                
                                {processingMode === 'upload' && (
                                    <>
                                        <button
                                            onClick={handleUpload}
                                            disabled={!selectedFile || isUploading}
                                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                    Uploading... {uploadProgress}%
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={16} />
                                                    Upload Video
                                                </>
                                            )}
                                        </button>
                                        
                                        {/* Upload Progress Bar */}
                                        {isUploading && (
                                            <div className="mt-3">
                                                <div className="flex justify-between text-sm text-purple-200 mb-1">
                                                    <span>Upload Progress</span>
                                                    <span>{uploadProgress}%</span>
                                                </div>
                                                <div className="w-full bg-purple-900/50 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    ></div>
                                                </div>
                                                {selectedFile && selectedFile.size > 1024 * 1024 * 1024 && (
                                                    <p className="text-purple-300 text-xs mt-2">
                                                        Large file upload in progress - please be patient...
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Video Info */}
                        {videoInfo && (
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <h3 className="text-lg font-semibold text-white mb-3">Video Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-purple-300">Duration:</span>
                                        <span className="text-white ml-2">
                                            {formatDuration(parseFloat(videoInfo.format?.duration || 0))}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-purple-300">Size:</span>
                                        <span className="text-white ml-2">
                                            {formatBytes(parseInt(videoInfo.format?.size || 0))}
                                        </span>
                                    </div>
                                    {videoInfo.streams?.[0] && (
                                        <>
                                            <div>
                                                <span className="text-purple-300">Resolution:</span>
                                                <span className="text-white ml-2">
                                                    {videoInfo.streams[0].width}x{videoInfo.streams[0].height}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-purple-300">Codec:</span>
                                                <span className="text-white ml-2 uppercase">
                                                    {videoInfo.streams[0].codec_name}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Video Preview */}
                        {(uploadedFilename || localFilePath || processedVideoUrl || previewUrl) && (
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Video Preview</h3>
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 text-white text-sm">
                                            <input
                                                type="checkbox"
                                                checked={livePreviewEnabled}
                                                onChange={(e) => {
                                                    setLivePreviewEnabled(e.target.checked);
                                                    if (e.target.checked && (uploadedFilename || localFilePath)) {
                                                        // Generate initial frame preview
                                                        setTimeout(() => generateFramePreview(), 100);
                                                    }
                                                }}
                                                className="accent-purple-500"
                                            />
                                            Live Preview
                                        </label>
                                        {livePreviewEnabled && (
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Main Video Player */}
                                    <div className="relative bg-black rounded-lg overflow-hidden">
                                        {(processedVideoUrl || previewUrl || (uploadedFilename && !localFilePath)) ? (
                                            <video
                                                ref={videoRef}
                                                className="w-full h-auto max-h-96"
                                                controls
                                                key={previewUrl || processedVideoUrl || uploadedFilename}
                                                src={processedVideoUrl || previewUrl || `http://localhost:5001/uploads/${uploadedFilename}`}
                                                onPlay={() => setIsPlaying(true)}
                                                onPause={() => setIsPlaying(false)}
                                                onTimeUpdate={handleVideoTimeUpdate}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : localFilePath ? (
                                            <div className="flex flex-col items-center justify-center h-96 text-white bg-gray-800 rounded-lg">
                                                <div className="text-center space-y-4">
                                                    <svg className="w-16 h-16 mx-auto text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-2">Video Format Not Supported for Preview</h3>
                                                        <p className="text-gray-300 text-sm mb-2">
                                                            MKV files cannot be previewed in the browser
                                                        </p>
                                                        <p className="text-green-300 text-sm">
                                                            ✅ Processing will work normally - use Live Preview below!
                                                        </p>
                                                        <div className="mt-3 p-3 bg-blue-900/30 rounded-lg">
                                                            <p className="text-blue-200 text-xs">
                                                                💡 Enable Live Preview to see frame-by-frame effects preview even for MKV files
                                                            </p>
                                                        </div>
                                                        {localFilePath && (
                                                            <p className="text-blue-300 text-xs mt-2 break-all">
                                                                📁 {localFilePath.split('/').pop()}
                                                            </p>
                                                        )}
                                                        
                                                        {/* Manual time control for unsupported formats */}
                                                        {videoInfo && videoInfo.format && (
                                                            <div className="mt-4 space-y-2">
                                                                <label className="text-white text-sm">
                                                                    Time Position: {Math.floor(currentVideoTime / 60)}:{Math.floor(currentVideoTime % 60).toString().padStart(2, '0')}
                                                                </label>
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max={parseFloat(videoInfo.format?.duration || 0)}
                                                                    step="0.1"
                                                                    value={currentVideoTime}
                                                                    onChange={(e) => handleManualTimeChange(parseFloat(e.target.value))}
                                                                    className="w-full accent-blue-500"
                                                                />
                                                                <div className="flex justify-between text-xs text-gray-400">
                                                                    <span>0:00</span>
                                                                    <span>{formatDuration(parseFloat(videoInfo.format?.duration || 0))}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <video
                                                ref={videoRef}
                                                className="w-full h-auto max-h-96"
                                                controls
                                                onPlay={() => setIsPlaying(true)}
                                                onPause={() => setIsPlaying(false)}
                                                onTimeUpdate={handleVideoTimeUpdate}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                        
                                        {livePreviewEnabled && !processedVideoUrl && (
                                            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                Live Preview
                                            </div>
                                        )}
                                        
                                        {/* Current Time Display */}
                                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                            {Math.floor(currentVideoTime / 60)}:{Math.floor(currentVideoTime % 60).toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                    
                                    {/* Live Frame Preview */}
                                    {livePreviewEnabled && framePreviewUrl && (
                                        <div className="bg-gray-900 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-white text-sm font-medium">Live Frame Preview</h4>
                                                <span className="text-purple-300 text-xs">
                                                    Current: {Math.floor(currentVideoTime / 60)}:{Math.floor(currentVideoTime % 60).toString().padStart(2, '0')}
                                                </span>
                                            </div>
                                            <div className="relative bg-black rounded overflow-hidden">
                                                <img
                                                    src={framePreviewUrl}
                                                    alt="Live frame preview"
                                                    className="w-full h-auto max-h-48 object-contain"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <div className="absolute top-1 left-1 bg-green-500 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                                    LIVE
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-4 flex gap-3 flex-wrap">
                                    <button
                                        onClick={handlePlayPause}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                        {isPlaying ? 'Pause' : 'Play'}
                                    </button>
                                    
                                    {livePreviewEnabled && !processedVideoUrl && (
                                        <>
                                            <button
                                                onClick={generateLivePreview}
                                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                <Eye size={16} />
                                                Refresh Video Preview
                                            </button>
                                            <button
                                                onClick={generateFramePreview}
                                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                <Eye size={16} />
                                                Update Frame
                                            </button>
                                        </>
                                    )}
                                    
                                    {processedVideoUrl && (
                                        <a
                                            href={processedVideoUrl}
                                            download
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <Download size={16} />
                                            Download
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Sidebar */}
                    <div className="w-full lg:w-80 lg:max-h-screen lg:overflow-y-auto space-y-4">
                        {/* Sidebar Header */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 lg:sticky lg:top-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Sliders size={20} />
                                Video Settings
                            </h2>
                        </div>

                        {/* Settings Sections */}
                        <div className="space-y-3">
                        {sidebarSections.map((section) => {
                            const IconComponent = section.icon;
                            const isCollapsed = collapsedSections[section.id];
                            
                            return (
                                <div key={section.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
                                    {/* Section Header */}
                                    <div 
                                        className={`p-3 cursor-pointer hover:bg-white/5 transition-colors border-l-4 border-${section.color}-500`}
                                        onClick={() => toggleSection(section.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <IconComponent size={16} className={`text-${section.color}-400`} />
                                                <span className="text-white font-medium text-sm">{section.title}</span>
                                            </div>
                                            {isCollapsed ? <ChevronDown size={14} className="text-white/60" /> : <ChevronUp size={14} className="text-white/60" />}
                                        </div>
                                    </div>

                                    {/* Section Content */}
                                    {!isCollapsed && (
                                        <div className="p-3 pt-0 space-y-3">
                                            {section.id === 'audio' && (
                                                <div>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className="text-white text-xs font-medium">Volume</label>
                                                        <span className="text-purple-300 text-xs font-mono">
                                                            {Math.round(settings.volume * 100)}%
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="3"
                                                        step="0.1"
                                                        value={settings.volume}
                                                        onChange={(e) => handleSettingChange('volume', parseFloat(e.target.value))}
                                                        className="w-full accent-purple-500 bg-white/20 rounded-lg"
                                                    />
                                                    <div className="flex justify-between text-xs text-white/60 mt-0.5">
                                                        <span>0%</span>
                                                        <span>100%</span>
                                                        <span>300%</span>
                                                    </div>
                                                </div>
                                            )}

                                            {section.id === 'visual' && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="text-white text-sm font-medium">Brightness</label>
                                                            <span className="text-blue-300 text-sm font-mono">
                                                                {settings.brightness > 0 ? '+' : ''}{Math.round(settings.brightness * 100)}
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="-1"
                                                            max="1"
                                                            step="0.05"
                                                            value={settings.brightness}
                                                            onChange={(e) => handleSettingChange('brightness', parseFloat(e.target.value))}
                                                            className="w-full accent-blue-500 bg-white/20 rounded-lg"
                                                        />
                                                        <div className="flex justify-between text-xs text-white/60 mt-1">
                                                            <span>-100</span>
                                                            <span>0</span>
                                                            <span>+100</span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="text-white text-sm font-medium">Contrast</label>
                                                            <span className="text-blue-300 text-sm font-mono">
                                                                {Math.round(settings.contrast * 100)}%
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="3"
                                                            step="0.05"
                                                            value={settings.contrast}
                                                            onChange={(e) => handleSettingChange('contrast', parseFloat(e.target.value))}
                                                            className="w-full accent-blue-500 bg-white/20 rounded-lg"
                                                        />
                                                        <div className="flex justify-between text-xs text-white/60 mt-1">
                                                            <span>0%</span>
                                                            <span>100%</span>
                                                            <span>300%</span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="text-white text-sm font-medium">Saturation</label>
                                                            <span className="text-blue-300 text-sm font-mono">
                                                                {Math.round(settings.saturation * 100)}%
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="3"
                                                            step="0.05"
                                                            value={settings.saturation}
                                                            onChange={(e) => handleSettingChange('saturation', parseFloat(e.target.value))}
                                                            className="w-full accent-blue-500 bg-white/20 rounded-lg"
                                                        />
                                                        <div className="flex justify-between text-xs text-white/60 mt-1">
                                                            <span>0%</span>
                                                            <span>100%</span>
                                                            <span>300%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {section.id === 'effects' && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="text-white text-sm font-medium">Blur</label>
                                                            <span className="text-pink-300 text-sm font-mono">
                                                                {settings.blur}px
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="10"
                                                            step="0.5"
                                                            value={settings.blur}
                                                            onChange={(e) => handleSettingChange('blur', parseFloat(e.target.value))}
                                                            className="w-full accent-pink-500 bg-white/20 rounded-lg"
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="text-white text-sm font-medium">Sharpen</label>
                                                            <span className="text-pink-300 text-sm font-mono">
                                                                {settings.sharpen}
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="5"
                                                            step="0.1"
                                                            value={settings.sharpen}
                                                            onChange={(e) => handleSettingChange('sharpen', parseFloat(e.target.value))}
                                                            className="w-full accent-pink-500 bg-white/20 rounded-lg"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-white text-sm font-medium block mb-2">Noise Reduction</label>
                                                        <select
                                                            value={settings.noise_reduction}
                                                            onChange={(e) => handleSettingChange('noise_reduction', e.target.value)}
                                                            className="w-full bg-black/30 text-white border border-pink-400/50 rounded-lg px-3 py-2 focus:border-pink-400 transition-colors"
                                                        >
                                                            {noiseReductionOptions.map(option => (
                                                                <option key={option.value} value={option.value} className="bg-gray-800">
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                                                        <input
                                                            type="checkbox"
                                                            id="stabilization"
                                                            checked={settings.stabilization}
                                                            onChange={(e) => handleSettingChange('stabilization', e.target.checked)}
                                                            className="accent-pink-500 w-4 h-4"
                                                        />
                                                        <label htmlFor="stabilization" className="text-white text-sm font-medium">
                                                            Video Stabilization
                                                        </label>
                                                    </div>
                                                </div>
                                            )}

                                            {section.id === 'performance' && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="text-white text-sm font-medium">Playback Speed</label>
                                                            <span className="text-green-300 text-sm font-mono">
                                                                {settings.speed}x
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0.25"
                                                            max="4"
                                                            step="0.25"
                                                            value={settings.speed}
                                                            onChange={(e) => handleSettingChange('speed', parseFloat(e.target.value))}
                                                            className="w-full accent-green-500 bg-white/20 rounded-lg"
                                                        />
                                                        <div className="flex justify-between text-xs text-white/60 mt-1">
                                                            <span>0.25x</span>
                                                            <span>1x</span>
                                                            <span>4x</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {section.id === 'output' && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-white text-sm font-medium block mb-2">Output Format</label>
                                                        <select
                                                            value={settings.format}
                                                            onChange={(e) => handleSettingChange('format', e.target.value)}
                                                            className="w-full bg-black/30 text-white border border-orange-400/50 rounded-lg px-3 py-2 focus:border-orange-400 transition-colors"
                                                        >
                                                            {formatOptions.map(option => (
                                                                <option key={option.value} value={option.value} className="bg-gray-800">
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            {section.id === 'presets' && (
                                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                                    {/* Clear All Filters Button */}
                                                    {settings.filters.length > 0 && (
                                                        <button
                                                            onClick={() => {
                                                                const newSettings = { ...settings, filters: [] };
                                                                setSettings(newSettings);
                                                                if (livePreviewEnabled && (uploadedFilename || localFilePath)) {
                                                                    setTimeout(() => generateFramePreviewWithSettings(newSettings), 100);
                                                                }
                                                            }}
                                                            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs transition-colors"
                                                        >
                                                            Clear All ({settings.filters.length})
                                                        </button>
                                                    )}
                                                    
                                                    {/* Active Filters Display */}
                                                    {settings.filters.length > 0 && (
                                                        <div className="bg-indigo-900/30 p-2 rounded-lg">
                                                            <div className="flex flex-wrap gap-1">
                                                                {settings.filters.map(filterId => {
                                                                    const filter = presetFilters.find(f => f.id === filterId);
                                                                    return filter ? (
                                                                        <span key={filterId} className="text-white bg-indigo-600 px-2 py-0.5 rounded text-xs">
                                                                            {filter.name}
                                                                        </span>
                                                                    ) : null;
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="space-y-1.5">
                                                        {presetFilters.map(filter => (
                                                            <div
                                                                key={filter.id}
                                                                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                                                                    settings.filters.includes(filter.id)
                                                                        ? 'bg-indigo-600/50 border-indigo-400 shadow-lg'
                                                                        : 'bg-black/20 border-white/20 hover:border-indigo-400 hover:bg-white/5'
                                                                }`}
                                                                onClick={() => handleFilterToggle(filter.id)}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <h4 className="text-white font-medium text-xs truncate">{filter.name}</h4>
                                                                            <span className="text-indigo-300 text-xs px-1.5 py-0.5 bg-indigo-900/30 rounded shrink-0">
                                                                                {filter.group}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-indigo-200 text-xs truncate">{filter.description}</p>
                                                                    </div>
                                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ml-2 shrink-0 ${
                                                                        settings.filters.includes(filter.id)
                                                                            ? 'bg-indigo-500 border-indigo-500'
                                                                            : 'border-white/40'
                                                                    }`}>
                                                                        {settings.filters.includes(filter.id) && (
                                                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleProcess}
                                disabled={(!uploadedFilename && !localFilePath) || isProcessing}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Film size={16} />
                                        {processingMode === 'local' ? 'Process Local File' : 'Process Video'}
                                    </>
                                )}
                            </button>

                            <button
                                onClick={resetSettings}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-lg"
                            >
                                Reset All Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoEditor;