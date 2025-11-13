import React, { useState } from 'react';
import { runCrackDemo, CrackDemoResponse, CrackResult } from '../../services/adminService';
import { Shield, ShieldOff, KeyRound, PlayCircle, Loader, AlertTriangle } from 'lucide-react';

// In-component CSS for animations and styling
const styles = `
    .fade-in {
        animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .skeleton-loading {
        animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;

const ResultCard: React.FC<{ result: CrackResult }> = ({ result }) => {
    const isCracked = result.cracked;
    const themeColor = isCracked ? 'var(--bs-danger)' : 'var(--bs-success)';
    const Icon = isCracked ? ShieldOff : Shield;

    return (
        <div className="card h-100 shadow-sm fade-in" style={{ borderTop: `4px solid ${themeColor}` }}>
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h4 className="card-title mb-0">{result.algorithm}</h4>
                    <Icon size={40} color={themeColor} />
                </div>
                
                <div className="mb-3">
                    <p className="mb-1">
                        <strong>Status:</strong>
                        <span style={{ color: themeColor, fontWeight: 500 }}>
                            {isCracked ? ` Cracked` : ` Secure`}
                        </span>
                    </p>
                    <p className="mb-1 text-muted">
                        {isCracked ? `Found in ${result.timeTakenMs} ms` : `Not cracked within time limit`}
                    </p>
                </div>

                <div className="mt-auto">
                    <p className="mb-1">
                        <strong>Attempts:</strong> {result.attempts.toLocaleString()}
                    </p>
                    {isCracked && (
                         <p className="mb-2">
                            <strong>Password:</strong> <span className="fw-bold" style={{ color: themeColor }}>{result.crackedPassword}</span>
                        </p>
                    )}
                    <p className="card-text text-muted" style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>
                        <small><strong>Hash:</strong> {result.hash}</small>
                    </p>
                </div>
            </div>
        </div>
    );
};

const SkeletonCard: React.FC = () => (
    <div className="card h-100 shadow-sm skeleton-loading">
        <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
                <div className="placeholder col-4 rounded"></div>
                <div className="placeholder" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
            </div>
            <div className="placeholder col-6 rounded mb-2"></div>
            <div className="placeholder col-8 rounded"></div>
            <div className="mt-auto pt-3">
                <div className="placeholder col-7 rounded mb-2"></div>
                <div className="placeholder col-12 rounded"></div>
            </div>
        </div>
    </div>
);


const CrackDemo: React.FC<{ onNewResult: () => void }> = ({ onNewResult }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<CrackDemoResponse | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await runCrackDemo(password);
            setResponse(result);
            onNewResult();
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="card shadow-sm mb-4 bg-light border-0">
                <div className="card-body p-4">
                    <h3 className="card-title mb-3">Control Panel</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><KeyRound size={20} /></span>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter a short password (e.g., 'test')"
                                maxLength={6}
                                required
                                disabled={loading}
                            />
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? <Loader className="spinner-border-sm" /> : <PlayCircle />}
                                <span className="ms-2">{loading ? 'Testing...' : 'Run Test'}</span>
                            </button>
                        </div>
                        <div className="form-text ps-1">
                            Enter a password of up to 6 lowercase letters and/or numbers.
                        </div>
                    </form>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger d-flex align-items-center fade-in" role="alert">
                    <AlertTriangle className="me-2" />
                    <div><strong>Error:</strong> {error}</div>
                </div>
            )}

            <div className="mt-4">
                {loading && (
                     <div className="row g-4">
                        {[...Array(3)].map((_, i) => (
                            <div className="col-lg-4" key={i}><SkeletonCard /></div>
                        ))}
                    </div>
                )}
                {response && (
                    <>
                        <h4 className="mb-3">Results for: <span className="fw-bold">"{response.originalPassword}"</span></h4>
                        <div className="row g-4">
                            {response.results.map((result) => (
                                <div className="col-lg-4" key={result.algorithm}>
                                    <ResultCard result={result} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CrackDemo;
