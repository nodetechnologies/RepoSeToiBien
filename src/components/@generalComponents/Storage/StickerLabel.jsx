import { Typography } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';

const StickerLabel = ({
  itemId,
  name,
  targetName,
  attribute1,
  attribute2,
  attribute3,
  dependencyName,
}) => {
  const qrCodeValue = `{"type":"STORAGE","id":"${itemId}"}`;

  return (
    <div
      className="align-c"
      style={{ width: '2.2in', height: '3.65in', alignContent: 'center' }}
    >
      <div>
        <Typography variant="body1" fontSize="12px" fontWeight={400}>
          {attribute1}
        </Typography>
      </div>
      <div>
        <Typography variant="body1" fontSize="12px" fontWeight={400}>
          {attribute2}
        </Typography>
      </div>
      <div className="mb-2 mt-2">
        <Typography variant="h3" fontSize="18px" fontWeight={600}>
          {name}
        </Typography>
      </div>
      <div>
        <Typography variant="body1" fontSize="13px" fontWeight={600}>
          {targetName}
        </Typography>
      </div>
      <div>
        <Typography variant="body1" fontSize="12px" fontWeight={500}>
          {attribute3}
        </Typography>
      </div>
      <div className="mb-3">
        <Typography variant="body1" fontSize="11px" fontWeight={500}>
          {dependencyName}
        </Typography>
      </div>
      <div style={{ position: 'relative' }}>
        <img
          src="/assets/website/2.0/square-node.png"
          width={40}
          height={40}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            marginTop: 60,
            marginLeft: 60,
          }}
        />
        <QRCodeCanvas value={qrCodeValue} size={158} />{' '}
      </div>
    </div>
  );
};

export default StickerLabel;
