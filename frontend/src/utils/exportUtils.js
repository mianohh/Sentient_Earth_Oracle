export const exportAsImage = async (elementId, filename = 'oracle-reading') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Import html2canvas dynamically
    const html2canvas = (await import('html2canvas')).default;
    
    // Configure html2canvas options
    const canvas = await html2canvas(element, {
      backgroundColor: '#0f0f23',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
      ignoreElements: (el) => {
        // Ignore settings button and other UI elements
        return el.classList.contains('fixed') || el.classList.contains('absolute');
      }
    });

    // Create download link
    const link = document.createElement('a');
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    
    // Fallback to text export if image fails
    const element = document.getElementById(elementId);
    if (element) {
      const content = element.innerText;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.txt`;
      link.href = url;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    }
    
    return false;
  }
};