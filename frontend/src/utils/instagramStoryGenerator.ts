interface StoryConfig {
  title: string;
  subtitle: string;
  emoji: string;
  message: string;
  logoUrl?: string;
  customBackgroundUrl?: string;
  backgroundType: 'gradient' | 'pattern' | 'solid' | 'custom';
}

// Travel Butts brand colors
const BRAND_COLORS = {
  primary: '#ffffff',
  secondary: '#11454c',
  neutralLight: '#bee4ea',
  accent: '#0b9195',
  accentDark: '#087579'
};

// Generate Instagram Story image for quiz results
export const generateInstagramStoryImage = async (config: StoryConfig): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    // Instagram Story dimensions
    canvas.width = 1080;
    canvas.height = 1920;

    // Function to draw content after background is ready
    const drawContent = () => {
      // Add decorative elements if not using custom background
      if (config.backgroundType !== 'custom') {
        addDecorativeElements(ctx, canvas.width, canvas.height);
      } else {
        // Add subtle overlay for better text readability on custom backgrounds
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Load and draw logo if available
      if (config.logoUrl) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.onload = () => {
          // Draw logo at top
          const logoSize = 120;
          const logoX = (canvas.width - logoSize) / 2;
          const logoY = 150;
          
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          
          // Continue with text after logo loads
          drawTextContent(ctx, config, canvas.width, canvas.height, logoY + logoSize + 80);
          resolve(canvas.toDataURL('image/png'));
        };
        logoImg.onerror = () => {
          // Continue without logo
          drawTextContent(ctx, config, canvas.width, canvas.height, 250);
          resolve(canvas.toDataURL('image/png'));
        };
        logoImg.src = config.logoUrl;
      } else {
        // Draw without logo
        drawTextContent(ctx, config, canvas.width, canvas.height, 250);
        resolve(canvas.toDataURL('image/png'));
      }
    };

    // Handle background based on type
    if (config.backgroundType === 'custom' && config.customBackgroundUrl) {
      // Use custom background image
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.onload = () => {
        // Draw custom background to fill the canvas
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        drawContent();
      };
      bgImg.onerror = () => {
        // Fallback to gradient if custom image fails
        createGradientBackground(ctx, canvas);
        drawContent();
      };
      bgImg.src = config.customBackgroundUrl;
    } else {
      // Create gradient background
      createGradientBackground(ctx, canvas);
      drawContent();
    }
  });
};

const createGradientBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, BRAND_COLORS.accent);
  gradient.addColorStop(0.5, BRAND_COLORS.secondary);
  gradient.addColorStop(1, BRAND_COLORS.accentDark);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const addDecorativeElements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Add subtle geometric shapes
  ctx.globalAlpha = 0.1;
  
  // Large circle
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.2, 200, 0, Math.PI * 2);
  ctx.fillStyle = BRAND_COLORS.primary;
  ctx.fill();
  
  // Small circles
  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.8, 100, 0, Math.PI * 2);
  ctx.fillStyle = BRAND_COLORS.primary;
  ctx.fill();
  
  // Triangle
  ctx.beginPath();
  ctx.moveTo(width * 0.1, height * 0.3);
  ctx.lineTo(width * 0.25, height * 0.3);
  ctx.lineTo(width * 0.175, height * 0.15);
  ctx.closePath();
  ctx.fillStyle = BRAND_COLORS.primary;
  ctx.fill();
  
  ctx.globalAlpha = 1;
};

const drawTextContent = (
  ctx: CanvasRenderingContext2D, 
  config: StoryConfig, 
  width: number, 
  height: number, 
  startY: number
) => {
  let currentY = startY;
  
  // Set text properties
  ctx.textAlign = 'center';
  ctx.fillStyle = BRAND_COLORS.primary;
  
  // Add text shadow for better readability on custom backgrounds
  if (config.backgroundType === 'custom') {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }
  
  // Main emoji
  ctx.font = '120px Arial, sans-serif';
  ctx.fillText(config.emoji, width / 2, currentY);
  currentY += 150;
  
  // Title - perfectly centered with Gotham Medium
  ctx.font = 'bold 64px "Gotham Medium", "Gotham", "Montserrat", "Inter", "Helvetica", sans-serif';
  ctx.fillStyle = BRAND_COLORS.primary;
  
  // Handle multi-line title with perfect centering
  const titleLines = wrapText(ctx, config.title, width - 120);
  titleLines.forEach(line => {
    ctx.fillText(line, width / 2, currentY);
    currentY += 80;
  });
  
  currentY += 40;
  
  // Subtitle - perfectly centered with Gotham Medium
  ctx.font = '36px "Gotham Medium", "Gotham", "Montserrat", "Inter", "Helvetica", sans-serif';
  ctx.fillStyle = config.backgroundType === 'custom' ? BRAND_COLORS.primary : BRAND_COLORS.neutralLight;
  
  const subtitleLines = wrapText(ctx, config.subtitle, width - 160);
  subtitleLines.forEach(line => {
    ctx.fillText(line, width / 2, currentY);
    currentY += 50;
  });
  
  currentY += 80;
  
  // Travel message - perfectly centered with Gotham Medium
  ctx.font = 'bold 42px "Gotham Medium", "Gotham", "Montserrat", "Inter", "Helvetica", sans-serif';
  ctx.fillStyle = BRAND_COLORS.primary;
  
  const messageLines = wrapText(ctx, config.message, width - 120);
  messageLines.forEach(line => {
    ctx.fillText(line, width / 2, currentY);
    currentY += 60;
  });
  
  // Brand footer - perfectly centered with Gotham Medium
  currentY = height - 200;
  ctx.font = 'bold 48px "Gotham Medium", "Gotham", "Montserrat", "Inter", "Helvetica", sans-serif';
  ctx.fillStyle = BRAND_COLORS.primary;
  ctx.fillText('Travel Butts', width / 2, currentY);
  
  currentY += 60;
  ctx.font = '28px "Gotham Medium", "Gotham", "Montserrat", "Inter", "Helvetica", sans-serif';
  ctx.fillStyle = config.backgroundType === 'custom' ? BRAND_COLORS.primary : BRAND_COLORS.neutralLight;
  ctx.fillText('Pack smart, travel light, explore more.', width / 2, currentY);
  
  currentY += 50;
  ctx.font = '24px "Gotham Medium", "Gotham", "Montserrat", "Inter", "Helvetica", sans-serif';
  ctx.fillText('Take the quiz at travelbutts.com', width / 2, currentY);
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
};

// Download the generated image
export const downloadInstagramStory = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate story for Geography Quiz results
export const generateGeographyQuizStory = async (score: number, totalQuestions: number, logoUrl?: string): Promise<string> => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let emoji = '';
  let message = '';
  
  if (percentage >= 90) {
    emoji = '🌟';
    message = 'I\'m a geography master!';
  } else if (percentage >= 80) {
    emoji = '🎉';
    message = 'I know my world geography!';
  } else if (percentage >= 70) {
    emoji = '👏';
    message = 'Pretty good at geography!';
  } else if (percentage >= 60) {
    emoji = '👍';
    message = 'Learning about the world!';
  } else if (percentage >= 50) {
    emoji = '🗺️';
    message = 'Exploring world knowledge!';
  } else {
    emoji = '✈️';
    message = 'Ready to explore more!';
  }
  
  const config: StoryConfig = {
    title: `${score}/${totalQuestions}`,
    subtitle: `${percentage}% on the Geography Quiz!`,
    emoji,
    message,
    logoUrl,
    backgroundType: 'gradient'
  };
  
  return generateInstagramStoryImage(config);
};

// Generate story for Travel Style Quiz results
export const generateTravelStyleQuizStory = async (
  archetype: { name: string; emoji: string; description: string }, 
  isBlended: boolean,
  secondaryArchetype?: { name: string; emoji: string },
  logoUrl?: string,
  customBackgroundUrl?: string
): Promise<string> => {
  const title = isBlended && secondaryArchetype 
    ? `${archetype.name} + ${secondaryArchetype.name}`
    : archetype.name;
    
  const emoji = isBlended && secondaryArchetype
    ? `${archetype.emoji}${secondaryArchetype.emoji}`
    : archetype.emoji;
  
  const config: StoryConfig = {
    title,
    subtitle: archetype.description,
    emoji,
    message: 'This is my travel style. Discover your travel style now @Travelbutts',
    logoUrl,
    customBackgroundUrl,
    backgroundType: customBackgroundUrl ? 'custom' : 'gradient'
  };
  
  return generateInstagramStoryImage(config);
};
