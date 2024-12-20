import React, { useState } from 'react';
import QRCODE from 'qrcode';

function QrCode({item,size}) {
    const [src,setSrc] = useState('');
    QRCODE.toDataURL(`
                        storageItemId : ${item?.storageItemId?.storageItemId}
                        storageType : ${item?.storageItemId?.storageType}
                        FL : ${item?.storageItemId?.metadata?.FL}
                        FR : ${item?.storageItemId?.metadata?.FR}
                        RL : ${item?.storageItemId?.metadata?.RL}
                        RR : ${item?.storageItemId?.metadata?.RR}
                        profileId : ${item?.storageItemId?.profileId}
    `).then(data => setSrc(data))
  return (
    <>
     <img width="80px" height="80px" src={src} alt="" />
    </>
  );
}

export default QrCode;