import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import GeneralText from '../../stories/general-components/GeneralText';

function TextUpdaterNode({ data, isConnectable }) {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: data?.color,
        color: '#fff',
        fontWeight: 500,
        display: 'flex',
        fontSize: '8px',
        border: 'none',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <GeneralText
          text={data?.label}
          size="medium"
          fontSize="8px"
          primary={false}
        />
        <div>
          <GeneralText
            text={data?.sublabel}
            size="medium"
            fontSize="5px"
            primary={false}
          />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;
