import {
  Typography
} from '@mui/material';

const ArticleTile = ({ article }) => {
  return (
    <div
      style={{
        border: '1px solid #f2f2f2',
        borderRadius: '10px',
        padding: '6px',
      }}
    >
      <div className="mb-2">
        <img
          src={article?.image_bg}
          alt={article?.name?.split('(')[0]}
          style={{
            width: '100%',
            maxHeight: '130px',
            objectFit: 'cover',
            backgroundPosition: 'center',
            borderRadius: '10px',
          }}
        />
      </div>
      <div>
        <Typography
          variant="h6"
          gutterBottom
          fontSize="13px"
          fontWeight={600}
          textAlign="left"
        >
          {article?.name?.split('(')[0]}
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          fontSize="11px"
          fontWeight={400}
          textAlign="left"
        >
          {article?.description || '-'}
        </Typography>
      </div>
      <div></div>
    </div>
  );
};

export default ArticleTile;
