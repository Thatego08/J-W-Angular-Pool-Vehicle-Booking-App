const express = require('express');
const path = require('path');

const app = express();

// Serve static files from current directory (Angular build)
app.use(express.static(__dirname));

// Serve index.html for all routes (Angular routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Use Azure PORT or default 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));