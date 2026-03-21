import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QRVisualization } from '../components/QRVisualization';

describe('QRVisualization', () => {
  it('renders with valid CBU', () => {
    const validCBU = '1234567890123456789012';
    render(<QRVisualization cbu={validCBU} />);
    
    expect(screen.getByTestId('qr-container')).toBeTruthy();
    expect(screen.getByTestId('qr-code')).toBeTruthy();
    expect(screen.getByTestId('qr-cbu')).toHaveTextContent(validCBU);
  });

  it('renders with venue name', () => {
    const validCBU = '1234567890123456789012';
    const venueName = 'Bar El Gorila';
    render(<QRVisualization cbu={validCBU} venueName={venueName} />);
    
    expect(screen.getByTestId('qr-container')).toBeTruthy();
    expect(screen.getByTestId('venue-name')).toHaveTextContent(venueName);
  });

  it('displays correct CBU format', () => {
    const validCBU = '0000000000000000000000';
    render(<QRVisualization cbu={validCBU} />);
    
    expect(screen.getByTestId('qr-cbu')).toHaveTextContent('CBU: 0000000000000000000000');
  });
});
