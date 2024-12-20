import { useTheme, styled } from '@mui/material/styles';
import { FormControl, InputLabel } from '@mui/material';
import SliderMUI from '@mui/material/Slider';

export const Slider = ({
  variant = 'outlined',
  selections,
  label,
  value,
  onChange,
  field,
  ...props
}) => {
  const theme = useTheme();
  const isDarkmode = theme.palette.mode === 'dark';

  const transformSelections = (dataSelect) => {
    return dataSelect?.map((selection, index) => {
      return {
        value: index,
        label: selection.label,
        color: selection?.color,
      };
    });
  };

  const generateGradient = (selections) => {
    const mappedSelectionsColors = selections?.map(
      (selection) => selection?.color
    );
    const colors = mappedSelectionsColors;
    const step = 100 / (selections?.length - 1);
    let gradient = 'linear-gradient(to right, ';

    selections.forEach((selection, index) => {
      gradient += `${colors[index % colors?.length]} ${step * index}%, `;
    });

    gradient = gradient?.slice(0, -2);
    gradient += ')';

    return gradient;
  };

  const currentSelectionColor = (value) => {
    return selections[value]?.color || '#696969';
  };

  const LineSlider = styled(SliderMUI)({
    color: currentSelectionColor(value),
    height: 10,
    '& .MuiSlider-rail': {
      backgroundImage: generateGradient(selections),
      height: 12,
    },
    '& .MuiSlider-track': {
      backgroundImage: generateGradient(selections),
      border: 'none',
      height: 12,
    },
    '& .MuiSlider-thumb': {
      height: 22,
      width: 22,
      backgroundColor: currentSelectionColor(value),
      '&::before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.6,
      fontSize: 10,
      background: 'unset',
      height: 25,
      borderRadius: '50% 50% 50% 0',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&::before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(45deg)',
      },
    },
    '& .MuiSlider-mark': {
      fontSize: 10,
      maxWidth: '20px',
    },
  });

  return (
    <div>
      <FormControl
        fullWidth
        margin="normal"
        sx={{
          border: '1px solid lightgray',
          borderRadius: '10px',
          padding: '10px',
        }}
      >
        <InputLabel
          shrink={true}
          required={props.required}
          error={props.error}
          sx={{
            backgroundColor: isDarkmode ? 'rgb(51,51,51)' : '#FFF',
            padding: '2px 10px 2px 10px',
            borderRadius: '10px',
          }}
        >
          {label}
        </InputLabel>
        <div style={{ paddingLeft: '25px', paddingRight: '25px' }}>
          <LineSlider
            min={0}
            max={selections?.length - 1}
            valueLabelDisplay="off"
            marks={transformSelections(selections)}
            onChange={(e) => onChange(field?.value, e.target.value)}
            value={value}
          />
        </div>
      </FormControl>
    </div>
  );
};

export default Slider;
