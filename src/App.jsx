{userData?.vmStatus === 'running' ? (
  <div style={{ marginTop: '20px' }}>
    <h3 style={{ textAlign: 'center', color: '#28a745' }}>Android VM Active</h3>
    <iframe 
      src="http://localhost:8080" 
      title="Android Cloud Stream"
      style={{ width: '100%', height: '550px', border: 'none', borderRadius: '8px' }}
    />
    <button 
      onClick={() => setUserData({ ...userData, vmStatus: 'stopped' })}
      style={{ width: '100%', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px' }}
    >
      Disconnect Session
    </button>
  </div>
) : (
  <button 
    onClick={() => setUserData({ ...userData, vmStatus: 'running' })}
    style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
  >
    Launch Android VM
  </button>
)}