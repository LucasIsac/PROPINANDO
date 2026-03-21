interface QRVisualizationProps {
  cbu: string;
  venueName?: string;
}

export function QRVisualization({ cbu, venueName }: QRVisualizationProps) {
  return (
    <div data-testid="qr-container" className="flex flex-col items-center">
      <div 
        data-testid="qr-code" 
        className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center"
      >
        <span className="text-gray-500 text-sm">QR</span>
      </div>
      {venueName && (
        <p className="text-sm mt-2 font-medium" data-testid="venue-name">
          {venueName}
        </p>
      )}
      <p data-testid="qr-cbu" className="text-xs text-gray-500 mt-1">
        CBU: {cbu}
      </p>
    </div>
  );
}
