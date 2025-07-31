import React from 'react';
import { useSearchParams } from 'react-router-dom';

export const CalendarTest: React.FC = () => {
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get('candidate_id');
  const userId = searchParams.get('user_id');

  console.log('CalendarTest - Raw params:', {
    candidateId,
    userId,
    allParams: Object.fromEntries(searchParams.entries())
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Calendar Test Page</h1>
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <h2>Debug Information:</h2>
        <p><strong>Candidate ID:</strong> {candidateId || 'MISSING'}</p>
        <p><strong>User ID:</strong> {userId || 'MISSING'}</p>
        <p><strong>Candidate ID Length:</strong> {candidateId?.length || 0}</p>
        <p><strong>User ID Length:</strong> {userId?.length || 0}</p>
      </div>
      
      <div style={{ background: '#e0e0e0', padding: '10px', margin: '10px 0' }}>
        <h2>All URL Parameters:</h2>
        <pre>{JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}</pre>
      </div>

      <div style={{ background: '#d0f0d0', padding: '10px', margin: '10px 0' }}>
        <h2>Cleaned Parameters:</h2>
        <p><strong>Trimmed Candidate ID:</strong> {candidateId?.trim()}</p>
        <p><strong>Trimmed User ID:</strong> {userId?.trim()}</p>
      </div>

      {candidateId && userId ? (
        <div style={{ background: '#d0f0d0', padding: '10px', margin: '10px 0' }}>
          <h2>✅ Parameters Present - Calendar would load here</h2>
        </div>
      ) : (
        <div style={{ background: '#f0d0d0', padding: '10px', margin: '10px 0' }}>
          <h2>❌ Missing Parameters</h2>
          <p>Required: candidate_id and user_id</p>
        </div>
      )}
    </div>
  );
};