const NotFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1
        style={{
          fontSize: '72px',
          fontWeight: '700',
          color: '#59b17a',
          margin: '0 0 10px 0',
          lineHeight: '1',
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1d1e21',
          margin: '0 0 12px 0',
        }}
      >
        Page not found
      </h2>

      <p
        style={{
          fontSize: '16px',
          color: '#1d1e21',
          opacity: 0.6,
          lineHeight: '1.5',
          margin: '0',
        }}
      >
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
    </div>
  );
};

export default NotFound;
