import AAVE from './AAVE.png';
import ADA from './ADA.png';
import BAL from './BAL.png';
import BAT from './BAT.png';
import BNB from './BNB.png';
import BNT from './BNT.png';
import BTC from './BTC.png';
import COMP from './COMP.png';
import COVER from './COVER.png';
import CURVE from './CURVE.png';
import DOT from './DOT.png';
import DPI from './DPI.png';
import ENJ from './ENJ.png';
import ETH from './ETH.png';
import FIL from './FIL.png';
import FTM from './FTM.png';
import KNC from './KNC.png';
import LINK from './LINK.png';
import LTC from './LTC.png';
import MATIC from './MATIC.png';
import MKR from './MKR.png';
import REN from './REN.png';
import SNX from './SNX.png';
import TRX from './TRX.png';
import UNI from './UNI.png';
import XAU from './XAU.png';
import XRP from './XRP.png';
import XTZ from './XTZ.png';
import YFI from './YFI.png';
import ZRX from './ZRX.png';

export const images = {
    AAVE,
    ADA,
    BAL,
    BAT,
    BNB,
    BNT,
    BTC,
    COMP,
    COVER,
    CURVE,
    DOT,
    DPI,
    ENJ,
    ETH,
    FIL,
    FTM,
    KNC,
    LINK,
    LTC,
    MATIC,
    MKR,
    REN,
    SNX,
    TRX,
    UNI,
    XAU,
    XRP,
    XTZ,
    YFI,
    ZRX
};

export const getCoinLogo = (ticker) => {
    const t = images[ticker];
    return images[ticker];
};
