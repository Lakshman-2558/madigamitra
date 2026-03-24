import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PrintableForm.css';

const PrintableForm = () => {
    const navigate = useNavigate();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="printable-form-wrapper">
            {/* Controls - Hidden on Print */}
            <div className="no-print-area">
                <button onClick={() => navigate('/home')} className="btn-back">
                    ← Back to Home
                </button>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: 0 }}>Matrimonial Enrolment Form</h3>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                        Ready for printing on a single A4 page
                    </p>
                </div>
                <div className="form-controls">
                    <button onClick={handlePrint} className="btn-print">
                        ⎙ Print Form
                    </button>
                    <a 
                        href="/application-form.png" 
                        download="Madigamitra-Application-Form.png"
                        className="btn-download"
                    >
                        ⬇ Download Form
                    </a>
                </div>
            </div>

            <div className="printable-form-image-container">
                <img
                    src="/application-form.png"
                    alt="Madigamitra Matrimonial Enrolment Form"
                    className="form-image-a4"
                />
            </div>

            {/* Submissions Note - Hidden on Print */}
            <div className="no-print-area whatsapp-submission-tip">
                <div className="whatsapp-tip-content">
                    <span style={{ fontSize: '1.5rem' }}>📢</span>
                    <p>
                        <strong>Note:</strong> Please send a neat photo of the applicant 
                        along with the completed application form to our WhatsApp number.
                        <br />
                        <strong>సూచన:</strong> దయచేసి పూర్తి చేసిన దరఖాస్తు ఫారమ్‌తో పాటు అభ్యర్థి యొక్క స్పష్టమైన ఫోటోను మా వాట్సాప్ నంబర్‌కు పంపండి.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrintableForm;
