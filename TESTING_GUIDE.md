# 🧪 Testing Guide - New Features

## Installation & Setup

1. **Install new dependencies**:
```bash
cd frontend
npm install recharts html2canvas
```

2. **Restart servers**:
```bash
# Terminal 1
npm run dev:backend

# Terminal 2  
npm run dev:frontend
```

## Feature Testing

### 1. 📈 Emotion Timeline
**Location**: Appears above oracle response
**Test Steps**:
1. Open http://localhost:3000
2. Submit an emotion (timeline loads automatically)
3. Verify chart shows 10 data points
4. Hover over points to see tooltips
5. Check responsive design on mobile

**Expected Result**: Line chart with emotion data and smooth animations

### 2. 🌍 Earth Connection Score
**Location**: Right side of vibe score (grid layout)
**Test Steps**:
1. Generate oracle response
2. Look for circular progress bar next to vibe score
3. Verify score is 0-100 range
4. Check smooth animation on load

**Expected Result**: Circular progress indicator with Earth connection score

### 3. 🌤️ Earth Trend Insight
**Location**: Below oracle narrative
**Test Steps**:
1. Generate oracle response
2. Scroll to oracle prophecy section
3. Look for "Earth Trend" box below narrative
4. Verify trend message appears

**Expected Result**: Small insight box with earth trend information

### 4. 📸 Export Functionality
**Location**: Bottom action buttons
**Test Steps**:
1. Generate oracle response
2. Click "📸 Export as Image" button
3. Check browser downloads folder
4. Verify PNG file was created
5. Open image to verify quality

**Expected Result**: High-quality PNG download of oracle reading

### 5. ⚙️ Accessibility Settings
**Location**: Settings button (top-right corner)
**Test Steps**:
1. Click gear icon (⚙️) in top-right
2. Toggle "Reduce Animations"
3. Toggle "High Contrast"
4. Close modal and verify changes applied
5. Refresh page - settings should persist

**Expected Result**: 
- Reduced animations: Faster transitions
- High contrast: More visible text

### 6. 🛡️ Safety Filter
**Test Steps**:
1. Enter harmful content: "I want to hurt myself"
2. Submit form
3. Verify safety message appears instead of normal oracle response
4. Check supportive actions are provided

**Expected Result**: Gentle redirect with mental health resources

### 7. 📊 Backend API Endpoints
**Test with curl**:

```bash
# Emotions timeline
curl http://localhost:3001/api/oracle/user/emotions-timeline

# Should return:
{
  "success": true,
  "data": [
    {
      "timestamp": "2024-01-01T00:00:00.000Z",
      "emotion": "joy",
      "vibeScore": 85
    }
  ]
}
```

## UI Screenshots/Descriptions

### Emotion Timeline
```
📈 Emotional Journey
Your vibe scores over time

[Line chart with 10 data points showing emotional progression]
```

### Earth Connection Score  
```
🌍 Earth Connection
    [Circular progress: 78/100]
Harmony between your emotions and Earth's energy
```

### Earth Trend Insight
```
🌍 Earth Trend
Air quality is improving today, supporting clearer thinking and enhanced focus.
```

### Settings Modal
```
⚙️ Settings

Reduce Animations          [Toggle: OFF]
Minimize motion for better focus

High Contrast             [Toggle: OFF]  
Enhance text visibility

                [Close]
```

### Export Buttons
```
[📸 Export as Image]  [🌙 Seek Another Vision]
```

## Performance Testing

1. **Timeline Loading**: Should load within 2 seconds
2. **Export Speed**: Image generation within 3 seconds  
3. **Settings Persistence**: Changes saved immediately
4. **Animation Performance**: Smooth 60fps animations
5. **Mobile Responsiveness**: All features work on mobile

## Error Scenarios

1. **Export Failure**: Graceful error handling
2. **Timeline API Error**: Shows loading state
3. **Settings Corruption**: Falls back to defaults
4. **Safety Filter**: Blocks harmful content appropriately

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+  
- ✅ Safari 14+
- ✅ Edge 90+

## Accessibility Testing

1. **Keyboard Navigation**: All buttons accessible via Tab
2. **Screen Readers**: Proper ARIA labels
3. **Color Contrast**: Meets WCAG AA standards
4. **Reduced Motion**: Respects user preferences

## Success Criteria

- [ ] All 7 features working correctly
- [ ] No console errors
- [ ] Responsive design maintained
- [ ] Accessibility features functional
- [ ] Export generates valid images
- [ ] Safety filter blocks harmful content
- [ ] Settings persist across sessions
- [ ] Timeline shows realistic data
- [ ] Earth connection score calculates properly
- [ ] Smooth animations and transitions