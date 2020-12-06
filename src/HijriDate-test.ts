import { HijriDate } from './HijriDate';

export function runAllHijriDateTests(): void {
  const results = [];
  const tests = [
    test0, test1, test2, test3, test4, test5, test6, test7, test8,
    test9, test10, test11, test12, test13, test14, test15, test16, test17, test18, test19, testGeneric];
  for (const test of tests) {
    results.push(test());
  }
  console.log('--------------------------- Test results start ---------------------------');
  for (const res of results) {
    console.log(res);
  }
  console.log('--------------------------- Test results end ---------------------------');

}

function test0(): boolean {
  const d1 = new HijriDate(1442, 3, 20);
  const d2 = new HijriDate(1442, 3, 20);
  return d1.dayDiff(d2) === 0;
}

function test1(): boolean {
  const d1 = new HijriDate(1442, 3, 20);
  const d2 = new HijriDate(1442, 3, 21);
  return d1.dayDiff(d2) === 1;
}

function test2(): boolean {
  const d1 = new HijriDate(1442, 3, 30);
  const d2 = new HijriDate(1442, 4, 1);
  return d1.dayDiff(d2) === 1;
}

function test3(): boolean {
  const d1 = new HijriDate(1442, 3, 1);
  const d2 = new HijriDate(1442, 3, 30);
  return d1.dayDiff(d2) === 29;
}

function test4(): boolean {
  try {
    new HijriDate(1442, 3, 31);
  } catch (error) {
    if (error.includes('day is either smaller tha')) {
      return true;
    }
    return false;
  }
  return false
}

function test5(): boolean {

  const d1 = new HijriDate().toHijri(new Date(2020, 11, 6));
  return d1.getYear() === 1442 && d1.getMonth() == 3 && d1.getDay() === 21;
}

function test6(): boolean {
  // 2020 start of sacred 3 months

  const d1 = new HijriDate().toHijri(new Date(2020, 1, 25));
  return d1.getYear() === 1441 && d1.getMonth() == 6 && d1.getDay() === 1;
}

function test7(): boolean {
  // 1441 C.ahir 01

  const d1 = new HijriDate().toHijri(new Date(2020, 0, 26));
  return d1.getYear() === 1441 && d1.getMonth() == 5 && d1.getDay() === 1;
}

function test8(): boolean {
  // 1441 Recep 01

  const d1 = new HijriDate().toHijri(new Date(2020, 1, 25));
  return d1.getYear() === 1441 && d1.getMonth() == 6 && d1.getDay() === 1;
}

function test9(): boolean {
  // 1441 Recep 03

  const d1 = new HijriDate().toHijri(new Date(2020, 1, 27));
  return d1.getYear() === 1441 && d1.getMonth() == 6 && d1.getDay() === 3;
}

function test10(): boolean {
  // 1441 Recep 26

  const d1 = new HijriDate().toHijri(new Date(2020, 2, 21));
  return d1.getYear() === 1441 && d1.getMonth() == 6 && d1.getDay() === 26;
}

function test11(): boolean {
  // 1441 Şaban 1

  const d1 = new HijriDate().toHijri(new Date(2020, 2, 25));
  return d1.getYear() === 1441 && d1.getMonth() == 7 && d1.getDay() === 1;
}

function test12(): boolean {
  // 1441 Şaban 14

  const d1 = new HijriDate().toHijri(new Date(2020, 3, 7));
  return d1.getYear() === 1441 && d1.getMonth() == 7 && d1.getDay() === 14;
}

function test13(): boolean {
  // 1441 Ramazan 1

  const d1 = new HijriDate().toHijri(new Date(2020, 3, 24));
  return d1.getYear() === 1441 && d1.getMonth() == 8 && d1.getDay() === 1;
}

function test14(): boolean {
  // 1441 Ramazan 26

  const d1 = new HijriDate().toHijri(new Date(2020, 4, 19));
  return d1.getYear() === 1441 && d1.getMonth() == 8 && d1.getDay() === 26;
}

function test15(): boolean {
  // 1441 Ramazan 30

  const d1 = new HijriDate().toHijri(new Date(2020, 4, 23));
  return d1.getYear() === 1441 && d1.getMonth() == 8 && d1.getDay() === 30;
}

function test16(): boolean {
  // 1441 Şevval 1

  const d1 = new HijriDate().toHijri(new Date(2020, 4, 24));
  return d1.getYear() === 1441 && d1.getMonth() == 9 && d1.getDay() === 1;
}

function test17(): boolean {
  // 1442 MUHARREM 1

  const d1 = new HijriDate().toHijri(new Date(2020, 7, 20));
  return d1.getYear() === 1442 && d1.getMonth() == 0 && d1.getDay() === 1;
}

function test18(): boolean {
  // 1442 R.AHİR 1

  const d1 = new HijriDate().toHijri(new Date(2020, 10, 16));
  return d1.getYear() === 1442 && d1.getMonth() == 3 && d1.getDay() === 1;
}

function test19(): boolean {
  // 1442 cemazilyel-evvel 1

  const d1 = new HijriDate().toHijri(new Date(2020, 11, 16));
  return d1.getYear() === 1442 && d1.getMonth() == 4 && d1.getDay() === 1;
}

function testGeneric(): boolean {
  const gregorian_dates = [
    [2021, 0, 14], [2021, 1, 13], [2021, 1, 18], [2021, 2, 10], [2021, 2, 14], [2021, 2, 27], [2021, 3, 13], [2021, 4, 8],
    [2021, 4, 12], [2021, 4, 13], [2021, 4, 14], [2021, 4, 15], [2021, 5, 11], [2021, 6, 11], [2021, 6, 19], [2021, 6, 20],
    [2021, 6, 21], [2021, 6, 22], [2021, 6, 23], [2021, 7, 9], [2021, 7, 18], [2021, 8, 8], [2021, 9, 7], [2021, 9, 17],
    [2021, 10, 6], [2021, 11, 5], [2027, 0, 4]];
  const hijri_dates = [
    [1442, 5, 1], [1442, 6, 1], [1442, 6, 6], [1442, 6, 26], [1442, 7, 1], [1442, 7, 14], [1442, 8, 1], [1442, 8, 26],
    [1442, 8, 30], [1442, 9, 1], [1442, 9, 2], [1442, 9, 3], [1442, 10, 1], [1442, 11, 1], [1442, 11, 9], [1442, 11, 10],
    [1442, 11, 11], [1442, 11, 12], [1442, 11, 13], [1443, 0, 1], [1443, 0, 10], [1443, 1, 1], [1443, 2, 1], [1443, 2, 11],
    [1443, 3, 1], [1443, 4, 1], [1448, 6, 26]];
  // 1442 cemazilyel-evvel 1
  for (let i = 0; i < gregorian_dates.length; i++) {

    const g = gregorian_dates[i];
    const h = hijri_dates[i];
    const d1 = new HijriDate().toHijri(new Date(g[0], g[1], g[2]));
    const isOk = d1.getYear() === h[0] && d1.getMonth() === h[1] && d1.getDay() === h[2];
    if (!isOk) {
      console.log('gregorian = ', g, ' hijri = ', h);
      return false;
    }
  }
  return true;

}