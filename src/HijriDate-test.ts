import { HijriDate } from './HijriDate';

export function runAllHijriDateTests() {
  const results = [];
  const tests = [test0, test1, test2, test3, test4];
  for (const test of tests) {
    results.push(test());
  }
  console.log('--------------------------- Test results start ---------------------------');
  for (const res of results) {
    console.log(res);
  }
  console.log('--------------------------- Test results end ---------------------------');

}

function test0() {
  const d1 = new HijriDate(1442, 3, 20);
  const d2 = new HijriDate(1442, 3, 20);
  return d1.dayDiff(d2) === 0;
}

function test1() {
  const d1 = new HijriDate(1442, 3, 20);
  const d2 = new HijriDate(1442, 3, 21);
  return d1.dayDiff(d2) === 1;
}

function test2() {
  const d1 = new HijriDate(1442, 3, 30);
  const d2 = new HijriDate(1442, 4, 1);
  return d1.dayDiff(d2) === 1;
}

function test3() {
  const d1 = new HijriDate(1442, 3, 1);
  const d2 = new HijriDate(1442, 3, 30);
  return d1.dayDiff(d2) === 29;
}

function test4() {
  try {
    const d2 = new HijriDate(1442, 3, 31);
  } catch (error) {
    if (error.includes('day is either smaller tha')) {
      return true;
    }
    return false;
  }
  return false
}