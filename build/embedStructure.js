(function () {
  // Get the current script tag
  const currentScript = document.currentScript;

  // Fetch the data attributes
  const businessId = currentScript.getAttribute('businessId');
  const structureId = currentScript.getAttribute('structureId');
  const width = currentScript.getAttribute('width');
  const height = currentScript.getAttribute('height');
  const type = currentScript.getAttribute('typeForm');

  // Create an iframe for the widget
  const iframe = document.createElement('iframe');
  iframe.src = `https://usenode.com/structure-public?businessId=${businessId}&structureId=${structureId}&type=${type}`;
  iframe.width = width || '100%';
  iframe.height = height || '600px';
  iframe.frameBorder = '0';

  // Get the embed container
  const embedContainer = document.getElementById('embed-container-node-form');

  // Append the iframe to the embed container
  if (embedContainer) {
    embedContainer.appendChild(iframe);
  }
})();
