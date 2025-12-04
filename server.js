const express = require('express');
const path = require('path');

const app = express();

// Serve Angular build output
app.use(express.static(path.join(__dirname, 'dist/admin-account')));

// Serve index.html for all routes (for Angular routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/admin-account/index.html'));
});

// Use Azure PORT or default 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
