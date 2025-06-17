import React, { useRef, useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrScanner = ({ onScanSuccess, onClose }) => {
  const html5QrCodeRef = useRef(null);
  const [scannerReady, setScannerReady] = useState(false);
  const isScanningRef = useRef(false);

  useEffect(() => {
    // Initialize scanner instance on mount
    html5QrCodeRef.current = new Html5Qrcode('reader', { verbose: true });
    setScannerReady(true);

    return () => {
      // Stop & clear scanner on unmount
      if (isScanningRef.current && html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .catch(() => {})
          .finally(() => {
            html5QrCodeRef.current.clear();
          });
      } else if (html5QrCodeRef.current) {
        html5QrCodeRef.current.clear();
      }
    };
  }, []);

  useEffect(() => {
    if (scannerReady) {
      startScanner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannerReady]);

  const startScanner = () => {
    if (!scannerReady || !html5QrCodeRef.current) return;

    html5QrCodeRef.current
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScanSuccess(decodedText);
          stopScanner();
        },
        (error) => {
          // You can log scan errors here if needed
          // console.log('QR Scan error:', error);
        }
      )
      .then(() => {
        isScanningRef.current = true;
      })
      .catch((err) => {
        console.error('Failed to start scanner:', err);
        alert(
          'Camera access denied or not available. Please check permissions and HTTPS.'
        );
        onClose();
      });
  };

  const stopScanner = () => {
    if (isScanningRef.current && html5QrCodeRef.current) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          isScanningRef.current = false;
          onClose();
        })
        .catch((err) => {
          console.error('Failed to stop scanner:', err);
        });
    }
  };

  return (
    <div>
      <div
        id="reader"
        style={{
          width: '100%',
          height: 300,
          marginTop: 16,
          backgroundColor: '#eee',
        }}
      />
      <button
        onClick={stopScanner}
        style={{ marginTop: 40, padding: '10px 30px' }}
        disabled={!scannerReady}
      >
        Stop Camera
      </button>
    </div>
  );
};

export default QrScanner;
