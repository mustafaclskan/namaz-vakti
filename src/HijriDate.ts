import { IntDict, Sabbatical } from './MetaType';

export class HijriDate {

  private readonly year: number;
  private readonly month: number;
  private readonly day: number;
  // months are 0 indexed, the others are 1 indexed
  private readonly BASE_HIJRI = { year: 1442, month: 3, day: 20 };
  private readonly BASE_GREGORORIAN = new Date(2020, 11, 5);
  private readonly MIN_YEAR = 1440;
  private readonly MAX_YEAR = 1600;
  private readonly MS_IN_DAY = 86400000;

  private readonly YEARS: IntDict = {
    1440: [29, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 29],
    1441: [30, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],
    1442: [29, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29],
    1443: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30],
    1444: [29, 30, 29, 30, 30, 29, 29, 30, 29, 30, 29, 30],
    1445: [29, 30, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30],
    1446: [29, 30, 30, 30, 29, 30, 30, 29, 29, 30, 29, 29],
    1447: [30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 30, 29],
    1448: [29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30],
    1449: [29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29],
    1450: [30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 29],
    1451: [30, 30, 30, 29, 29, 30, 29, 29, 30, 30, 29, 30],
    1452: [30, 29, 30, 30, 29, 29, 30, 29, 29, 30, 29, 30],
    1453: [30, 29, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29],
    1454: [30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30, 29],
    1455: [29, 30, 29, 30, 30, 29, 30, 29, 30, 30, 29, 30],
    1456: [29, 29, 30, 29, 30, 29, 30, 29, 30, 30, 30, 29],
    1457: [30, 29, 29, 30, 29, 29, 30, 29, 30, 30, 30, 30],
    1458: [29, 30, 29, 29, 30, 29, 29, 30, 29, 30, 30, 30],
    1459: [29, 30, 30, 29, 29, 30, 29, 29, 30, 29, 30, 30],
    1460: [29, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30],
    1461: [29, 30, 30, 29, 30, 29, 30, 29, 30, 30, 29, 29],
    1462: [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 30, 29],
    1463: [29, 30, 29, 30, 29, 30, 29, 30, 30, 30, 29, 30],
    1464: [29, 30, 29, 29, 30, 29, 29, 30, 30, 30, 29, 30],
    1465: [30, 29, 30, 29, 29, 30, 29, 29, 30, 30, 29, 30],
    1466: [30, 30, 29, 30, 29, 29, 29, 30, 29, 30, 30, 29],
    1467: [30, 30, 29, 30, 30, 29, 29, 30, 29, 30, 29, 30],
    1468: [29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29],
    1469: [29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30],
    1470: [29, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],
    1471: [30, 29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30],
    1472: [29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 29, 30],
    1473: [29, 30, 29, 30, 30, 29, 29, 30, 29, 30, 29, 30],
    1474: [29, 30, 30, 29, 30, 30, 29, 29, 30, 29, 30, 29],
    1475: [29, 30, 30, 29, 30, 30, 30, 29, 29, 30, 29, 29],
    1476: [30, 29, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29],
    1477: [29, 30, 29, 29, 30, 30, 30, 30, 29, 30, 29, 30],
    1478: [29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29],
    1479: [30, 29, 29, 30, 29, 30, 29, 30, 29, 30, 30, 29],
    1480: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
    1481: [30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29, 29],
    1482: [30, 29, 30, 30, 30, 30, 29, 30, 29, 29, 30, 29],
    1483: [29, 30, 29, 30, 30, 30, 29, 30, 30, 29, 29, 30],
    1484: [29, 29, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29],
    1485: [30, 29, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30],
    1486: [29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 29, 30],
    1487: [30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30],
    1488: [30, 29, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29],
    1489: [30, 29, 30, 30, 30, 29, 30, 29, 29, 30, 29, 30],
    1490: [29, 30, 29, 30, 30, 29, 30, 30, 29, 29, 30, 29],
    1491: [30, 29, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30],
    1492: [29, 30, 29, 29, 30, 30, 29, 30, 29, 30, 30, 29],
    1493: [30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 30, 30],
    1494: [29, 30, 29, 30, 29, 30, 29, 29, 29, 30, 30, 30],
    1495: [29, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30, 30],
    1496: [29, 30, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30],
    1497: [30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29, 30],
    1498: [29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29],
    1499: [30, 29, 30, 29, 29, 30, 30, 29, 30, 29, 30, 30],
    1500: [29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30],
    1501: [30, 29, 30, 29, 30, 29, 29, 29, 30, 29, 30, 30],
    1502: [30, 30, 29, 30, 29, 30, 29, 29, 29, 30, 30, 29],
    1503: [30, 30, 29, 30, 30, 29, 30, 29, 29, 29, 30, 30],
    1504: [29, 30, 29, 30, 30, 30, 29, 29, 30, 29, 30, 29],
    1505: [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 30, 29],
    1506: [29, 30, 29, 29, 30, 30, 29, 30, 30, 29, 30, 30],
    1507: [29, 29, 30, 29, 29, 30, 30, 29, 30, 29, 30, 30],
    1508: [30, 29, 29, 30, 29, 30, 29, 29, 30, 29, 30, 30],
    1509: [30, 29, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30],
    1510: [30, 29, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29],
    1511: [30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 29, 30],
    1512: [29, 30, 29, 30, 29, 30, 30, 30, 29, 30, 29, 30],
    1513: [29, 29, 29, 30, 29, 30, 30, 30, 29, 30, 30, 29],
    1514: [30, 29, 29, 29, 30, 29, 30, 30, 29, 30, 30, 30],
    1515: [29, 29, 30, 29, 29, 30, 29, 30, 30, 29, 30, 30],
    1516: [29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30],
    1517: [29, 30, 29, 30, 29, 30, 30, 29, 29, 30, 29, 30],
    1518: [29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 29],
    1519: [30, 29, 29, 30, 30, 30, 29, 30, 30, 29, 30, 29],
    1520: [29, 30, 29, 29, 30, 30, 30, 29, 30, 30, 29, 30],
    1521: [29, 29, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30],
    1522: [30, 29, 29, 29, 30, 29, 30, 30, 29, 30, 30, 29],
    1523: [30, 29, 30, 29, 30, 29, 30, 29, 29, 30, 30, 29],
    1524: [30, 30, 29, 30, 29, 30, 29, 30, 29, 29, 30, 29],
    1525: [30, 30, 29, 30, 30, 29, 30, 29, 30, 29, 29, 30],
    1526: [29, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 29],
    1527: [30, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],
    1528: [30, 29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30],
    1529: [29, 30, 29, 29, 30, 29, 30, 29, 30, 29, 30, 30],
    1530: [29, 30, 30, 29, 29, 30, 29, 30, 29, 29, 30, 30],
    1531: [29, 30, 30, 30, 29, 29, 30, 29, 30, 29, 29, 30],
    1532: [29, 30, 30, 30, 29, 30, 30, 29, 29, 29, 30, 29],
    1533: [30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 29, 30],
    1534: [29, 30, 29, 30, 30, 29, 30, 30, 29, 29, 30, 29],
    1535: [30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30],
    1536: [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30],
    1537: [30, 29, 30, 30, 29, 29, 30, 29, 29, 30, 29, 30],
    1538: [30, 30, 29, 30, 30, 29, 29, 30, 29, 29, 30, 29],
    1539: [30, 30, 30, 29, 30, 30, 29, 29, 30, 29, 29, 30],
    1540: [29, 30, 30, 29, 30, 30, 29, 30, 29, 29, 30, 29],
    1541: [30, 29, 30, 29, 30, 30, 30, 29, 30, 29, 29, 30],
    1542: [29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 30],
    1543: [29, 30, 29, 29, 30, 29, 30, 29, 30, 29, 30, 30],
    1544: [30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 29, 30],
    1545: [30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 29, 30],
    1546: [30, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 29],
    1547: [30, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29],
    1548: [30, 29, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30],
    1549: [29, 30, 29, 29, 30, 29, 30, 30, 30, 29, 30, 29],
    1550: [30, 29, 30, 29, 29, 29, 30, 30, 30, 29, 30, 30],
    1551: [29, 30, 29, 29, 30, 29, 29, 30, 30, 29, 30, 30],
    1552: [30, 29, 30, 29, 29, 30, 29, 29, 30, 30, 29, 30],
    1553: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
    1554: [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30],
    1555: [29, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],
    1556: [30, 29, 29, 30, 29, 30, 29, 30, 30, 30, 29, 30],
    1557: [29, 30, 29, 29, 29, 30, 29, 30, 30, 30, 30, 29],
    1558: [30, 29, 30, 29, 29, 29, 30, 29, 30, 30, 30, 29],
    1559: [30, 30, 29, 29, 30, 29, 29, 30, 30, 29, 30, 29],
    1560: [30, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30],
    1561: [29, 30, 30, 29, 30, 29, 30, 30, 29, 29, 30, 29],
    1562: [29, 30, 30, 29, 30, 29, 30, 30, 30, 29, 29, 30],
    1563: [29, 30, 29, 29, 30, 29, 30, 30, 30, 29, 30, 29],
    1564: [30, 29, 30, 29, 29, 30, 29, 30, 30, 30, 29, 30],
    1565: [29, 30, 29, 30, 29, 29, 30, 29, 30, 30, 29, 30],
    1566: [30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30],
    1567: [30, 29, 30, 30, 29, 30, 29, 30, 29, 29, 30, 29],
    1568: [30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 29, 29],
    1569: [30, 29, 30, 30, 30, 29, 30, 30, 29, 30, 29, 29],
    1570: [29, 30, 29, 30, 30, 29, 30, 30, 30, 29, 29, 30],
    1571: [29, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],
    1572: [30, 29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29],
    1573: [30, 29, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29],
    1574: [30, 30, 29, 30, 30, 29, 30, 29, 29, 30, 29, 29],
    1575: [30, 30, 30, 29, 30, 30, 29, 30, 29, 29, 29, 30],
    1576: [29, 30, 30, 29, 30, 30, 30, 29, 30, 29, 29, 29],
    1577: [30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30, 29],
    1578: [29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30],
    1579: [29, 30, 29, 30, 29, 29, 30, 30, 29, 30, 29, 30],
    1580: [29, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30],
    1581: [30, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 29],
    1582: [30, 30, 29, 30, 30, 29, 30, 29, 30, 29, 29, 29],
    1583: [30, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 29],
    1584: [29, 30, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],
    1585: [29, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30],
    1586: [29, 29, 30, 29, 30, 29, 29, 30, 30, 30, 29, 30],
    1587: [29, 30, 30, 29, 29, 29, 30, 29, 30, 29, 30, 30],
    1588: [30, 29, 30, 30, 29, 29, 29, 30, 29, 30, 29, 30],
    1589: [30, 29, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29],
    1590: [30, 29, 30, 30, 30, 29, 29, 30, 29, 30, 29, 30],
    1591: [29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29],
    1592: [30, 29, 30, 29, 30, 29, 30, 29, 30, 30, 30, 29],
    1593: [30, 29, 29, 30, 29, 29, 30, 29, 30, 30, 30, 29],
    1594: [30, 30, 29, 29, 30, 29, 29, 29, 30, 30, 30, 30],
    1595: [29, 30, 29, 30, 29, 29, 30, 29, 29, 30, 30, 30],
    1596: [29, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30],
    1597: [29, 30, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
    1598: [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 30, 29],
    1599: [29, 30, 29, 30, 29, 30, 29, 30, 30, 30, 29, 30],
    1600: [29, 29, 30, 29, 30, 29, 29, 30, 30, 30, 29, 30]
  }

  private readonly SABBATICALS: Sabbatical[] = [
    { month: 0, day: 1, name: 'year_beginning' },
    { month: 0, day: 10, name: 'day_of_ashura' },
    { month: 2, day: 11, name: 'mawlid_al_nabi' },
    { month: 6, day: 1, name: 'start_of_sacred3_months' },
    { month: 6, day: 3, name: 'laylat_al_raghaib ' },
    { month: 6, day: 26, name: 'miraj' },
    { month: 7, day: 14, name: 'baraat_night' },
    { month: 7, day: 14, name: 'baraat_night' },
    { month: 8, day: 1, name: 'start_of_ramadan' },
    { month: 8, day: 26, name: 'qadr_night' },
    { month: 8, day: 30, name: 'eve_of_eid_ramadan' },
    { month: 9, day: 1, name: 'eid_ramadan_1' },
    { month: 9, day: 2, name: 'eid_ramadan_2' },
    { month: 9, day: 3, name: 'eid_ramadan_3' },
    { month: 11, day: 9, name: 'eve_of_eid_qurban' },
    { month: 11, day: 10, name: 'eid_qurban_1' },
    { month: 11, day: 11, name: 'eid_qurban_2' },
    { month: 11, day: 12, name: 'eid_qurban_3' },
    { month: 11, day: 13, name: 'eid_qurban_4' },
  ]

  constructor(year = 1442, month = 3, day = 20) {
    this.isValidAndSupported(year, month, day);
    this.year = year;
    this.month = month;
    this.day = day;
  }
  /** converts gregorian date to HijriDate
   * @param  {Date} date
   * @returns HijriDate
   */
  toHijri(date: Date): HijriDate {
    const dayDiff = (date.getTime() - this.BASE_GREGORORIAN.getTime()) / this.MS_IN_DAY;
    return this.addDays(this.BASE_HIJRI.year, this.BASE_HIJRI.month, this.BASE_HIJRI.day, dayDiff);
  }

  toStr(): string {
    return this.year + ' ' + this.month + ' ' + this.day;
  }

  /** return the nearest Sabbatical after the provided date
   * @param  {Date} d
   */
  getNearestSabbatical(after: Date): { cnt: number, sabb: Sabbatical | undefined } {
    let hijri = this.toHijri(after);
    let cnt = 0;
    while (!this.getSabbaticalObj4Date(hijri)) {
      hijri = hijri.addDays(hijri.year, hijri.month, hijri.day, 1);
      cnt++;
    }
    return { cnt: cnt, sabb: this.getSabbaticalObj4Date(hijri) };
  }

  /** get sabbatical object from date if it corresponds to a sabbatical date
   * @param  {HijriDate} date
   * @returns Sabbatical
   */
  getSabbaticalObj4Date(date: HijriDate): Sabbatical | undefined {
    const m = date.getMonth();
    const d = date.getDay();
    return this.SABBATICALS.find(x => x.day === d && x.month === m);
  }

  /** return `cnt` number of Sabbaticals before `date` and `cnt` number of Sabbaticals after `date` 
   * @param  {Date} d
   */
  getAllSabbaticalsNear(date: Date, cnt = 19): { hijri: HijriDate, gre: Date, sabb: Sabbatical }[] {
    let hijri = this.toHijri(date);
    const sabbs = [];
    let tmpDate = new Date(date.getTime());
    let cntSabb = 0;
    while (cntSabb < cnt) {
      const sabbCand = this.getSabbaticalObj4Date(hijri);
      while (!sabbCand) {
        hijri = hijri.addDays(hijri.year, hijri.month, hijri.day, -1);
        tmpDate = new Date(tmpDate.getTime() - this.MS_IN_DAY);
      }
      cntSabb++;
      sabbs.push({ hijri: hijri, gre: tmpDate, sabb: sabbCand });
    }
    // now increase the date
    hijri = this.toHijri(date);
    tmpDate = new Date(date.getTime());
    cntSabb = 0;
    while (cntSabb < cnt) {
      const sabbCand = this.getSabbaticalObj4Date(hijri);
      while (!sabbCand) {
        hijri = hijri.addDays(hijri.year, hijri.month, hijri.day, 1);
        tmpDate = new Date(tmpDate.getTime() + this.MS_IN_DAY);
      }
      cntSabb++;
      sabbs.push({ hijri: hijri, gre: tmpDate, sabb: sabbCand });
    }
    return sabbs;
  }

  getYear(): number {
    return this.year;
  }

  getMonth(): number {
    return this.month;
  }

  getDay(): number {
    return this.day;
  }

  // add days to an hijri Year,Month,Day in linear time
  addDays(year: number, month: number, day: number, diff: number): HijriDate {
    const isPos = diff > 0;

    while (diff != 0) {
      if (isPos) {
        if (day < this.YEARS[year][month]) { // can increase the day
          day++;
        } else if (month < 11) { // should increase the month
          month++;
          day = 1;
        } else {
          year++;
          month = 0;
          day = 1;
        }
        diff--;
      } else {
        if (day > 1) { // can decrease the day
          day--;
        } else if (month > 0) { // should decrease the month
          month--;
          day = this.YEARS[year][month];
        } else {
          year--;
          month = 11;
          day = this.YEARS[year][month];
        }
        diff++;
      }
    }
    return new HijriDate(year, month, day);
  }

  dayDiff(date2: HijriDate): number {
    this.isValidAndSupported(date2.year, date2.month, date2.day);
    let comparison = this.compare(date2);
    if (comparison === 0) {
      return 0;
    }
    let daySum = 0;
    const bigDate = comparison > 0 ? this : date2;
    const smallDate = comparison < 0 ? this : date2;

    comparison = Math.abs(comparison);

    if (comparison === 1) {
      return bigDate.day - smallDate.day;
    }
    if (comparison == 2) {
      for (let m = smallDate.month; m < bigDate.month; m++) {
        daySum += this.YEARS[smallDate.year][m];
      }
      daySum -= smallDate.day;
      daySum += bigDate.day;
      return daySum;
    }
    if (comparison == 3) {
      for (let y = smallDate.year; y < bigDate.year; y++) {
        daySum += this.YEARS[y].reduce((a, b) => { return a + b; }, 0);
      }
      daySum -= this.YEARS[smallDate.year].slice(0, smallDate.month).reduce((a, b) => { return a + b }, 0);
      daySum -= smallDate.day;
      daySum += this.YEARS[bigDate.year].slice(0, smallDate.month).reduce((a, b) => { return a + b }, 0);
      daySum += bigDate.day;
      return daySum;
    }

    return -1;
  }

  isValidAndSupported(year: number, month: number, day: number): boolean {
    const isSupports = year >= 1440 && year <= 1600;
    if (!isSupports) {
      throw "Currently hijri years from " + this.MIN_YEAR + " to " + this.MAX_YEAR + " are supported";
    }
    if (month < 0 || month > 11) {
      throw "month should be in range [0,11] (both inclusive)";
    }
    if (day < 1 || day > this.YEARS[year][month]) {
      throw "day is either smaller than 1 or greater than maximum days in the month";
    }
    return true;
  }

  // return positive if `this` is greater, 0 if equal, negative if smaller
  compare(d: HijriDate): number {
    if (this.year > d.year) {
      return 3;
    } else if (d.year > this.year) {
      return -3;
    }

    if (this.month > d.month) {
      return 2;
    } else if (d.month > this.month) {
      return -2;
    }

    if (this.day > d.day) {
      return 1;
    } else if (d.day > this.day) {
      return -1;
    }
    return 0;
  }

}