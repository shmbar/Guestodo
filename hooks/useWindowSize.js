import { useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useWindowSize = () =>{
  const theme = useTheme();

  const matches = [...theme.breakpoints.keys].reverse();
  
	return  matches.reduce((output, key) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const matches = useMediaQuery(theme.breakpoints.up(key));
		return !output && matches ? key : output;
	  }, null) || 'xl';

  }


export default useWindowSize;


/*const scrn =(x) =>{
	let adjustedColsNum;
	 switch(true){
            case (x>1530):
                adjustedColsNum=12; break;
            case  (x<=1530 && x>1401):
                adjustedColsNum=11; break;
            case (x<=1401 && x>1180):
                adjustedColsNum=10; break;
            case (x<=1180 && x>1060):
                adjustedColsNum=9; break;
            case (x<=1060 && x>992):
                adjustedColsNum=8; break;
            case (x<=992 && x>791):
                adjustedColsNum=7; break;
            case (x<=791 && x>768):
                adjustedColsNum=6; break;
            case (x<=768 && x>550):
                adjustedColsNum=5; break;
            case (x<=550 && x>513):
                adjustedColsNum=4; break;
            case (x<=513):
                adjustedColsNum=3; break;
            default: return null;
    }
	return adjustedColsNum;
};

*/
/* 
function getBreakPoint(windowWidth) {
  if (windowWidth) {
    if (windowWidth < 600) {
      return "xs";
    } else if (windowWidth < 960 && windowWidth >= 600) {
      return "sm";
    } else if (windowWidth < 1280 && windowWidth >= 960) {
      return "md";
    } else if (windowWidth < 1920 && windowWidth >= 1280) {
      return "lg";
    } else {
      return "xl";
    }
  } else {
    return undefined;
  }
}


// Hook
const useWindowSize = () =>{
  const isClient = typeof window === 'object';

	 const getSize = () =>{
		return {
		  width: isClient ? window.innerWidth : undefined,
		  height: isClient ? window.innerHeight : undefined
		};
  }
	
	const [windowSize, setWindowSize] = React.useState(getSize);
	
  useEffect(() => {
    if (!isClient) {
      return false;
    }
	
	   const getSize = () =>{
			return {
			  width: isClient ? window.innerWidth : undefined,
			  height: isClient ? window.innerHeight : undefined
			};
  	}
	  
	const handleResize= ()=> {
     	setWindowSize(getSize());
    };
	  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]); // Empty array ensures that effect is only run on mount and unmount
	
	 
	
 // return scrn(windowSize.width);
 // eslint-disable-next-line react-hooks/rules-of-hooks
	return getBreakPoint(windowSize.width);
};

export default useWindowSize;

 */