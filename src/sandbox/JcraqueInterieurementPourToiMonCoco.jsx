import React, { useState, useEffect } from 'react';
import MainLayoutV2 from '../layouts/MainLayoutV2';

//Tu peux commenter la version public et décommenter la version app pour voir la différence

const CocoBulle = () => {
  return <div>On fait des grosses bulles, on joue au soumarin.</div>;
};

//---VERSION APP---
const JcraqueInterieurementPourToiMonCoco = () => {
  return (
    <MainLayoutV2
      pageTitle={"Ah c'quon est bien qunad qu'on est dans son bain"}
    >
      <CocoBulle />
    </MainLayoutV2>
  );
};

export default JcraqueInterieurementPourToiMonCoco;
