<template>
  <div class="container-fluid">
    <div class="calendar">
      <h2>
        <a href="#" v-on:click="onClickPrev(currentMonth)">◀</a>
        {{ currentYear }}년 {{ currentMonth }}월
        <a href="#" v-on:click="onClickNext(currentMonth)">▶</a>
      </h2>
      <table class="table table-hovers">
        <thead>
          <tr>
            <td
              v-for="(weekName, index) in weekNames"
              v-bind:key="index"
              :style="{
                color:
                  weekName === '토요일'
                    ? 'blue'
                    : weekName === '일요일'
                    ? 'red'
                    : 'inherit',
              }"
            >
              {{ weekName }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in currentCalendarMatrix" :key="rowIndex">
            <td
              v-for="(day, colIndex) in row"
              :key="colIndex"
              style="padding: 50px; cursor: pointer"
              @click="openModal(day)"
              data-bs-toggle="modal"
              data-bs-target="#myModal"
            >
              <div>
                <span v-if="day !== ''">
                  <span
                    v-if="isToday(currentYear, currentMonth, day)"
                    class="today"
                    >{{ day }}</span
                  >
                  <span v-else>{{ day }}</span>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="total">
        <div>
          수입합계: {{ calculateTotal('income') }} 지출합계:
          {{ calculateTotal('expense') }}
        </div>
      </div>
    </div>

    <!-- The Modal -->
    <div class="modal" id="myModal">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">가계부 쉽조1</h4>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <!-- Modal body -->
          <div class="modal-body">
            <div style="text-align: left">
              <p style="font-size: 20px; font-weight: bold;">메모</p>
              <div class="memo-section">
                <textarea
                  v-model="memo"
                  placeholder="메모를 입력하세요..."
                  class="memo-textarea"
                ></textarea>
              </div>
            </div>
          </div>
          <div>
            <div class="btn-group" style="margin-bottom : 5px">
              <button type="button" class="btn btn-outline-danger" @click="showTable = 'expense'">지출</button>
              <button type="button" class="btn btn-outline-success" @click="showTable = 'income'">수입</button>
            </div>
            <div v-if="showTable === 'expense'">
              <table class="expense-table">
                <thead class="expense-title">
                  <tr class="expense-title-row">
                    <th><input type="checkbox" /></th>
                    <th>사용내역</th>
                    <th>현금</th>
                    <th>카드</th>
                    <th>카드분류</th>
                    <th>분류</th>
                    <th>태그</th>
                  </tr>
                </thead>
                <tbody class="expense-data">
                  <tr class="expense-data-row">
                    <td><input type="checkbox" /></td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="showTable === 'income'">
              <table class="income-table">
                <thead class="income-title">
                  <tr class="income-title-row">
                    <th><input type="checkbox" /></th>
                    <th>내역</th>
                    <th>금액</th>
                    <th>입금통장</th>
                    <th>분류</th>
                    <th>태그</th>
                  </tr>
                </thead>
                <tbody class="income-data">
                  <tr class="income-data-row">
                    <td><input type="checkbox" /></td>
                    <td><input type="text" style="width : 110px"></td>
                    <td><input type="text" class="small-input"></td>
                    <td><input type="text" class="small-input"></td>
                    <td>
                      <select class="form-select">
                        <option>월급</option>
                        <option>용돈</option>
                        <option>기타 수입</option>
                        <option>이자/배당</option>
                      </select>
                    </td>
                    <td><input type="text" class="small-input"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    return {
      weekNames: [
        '일요일',
        '월요일',
        '화요일',
        '수요일',
        '목요일',
        '금요일',
        '토요일',
      ],
      rootYear: 1904,
      rootDayOfWeekIndex: 4, // 2000년 1월 1일은 토요일
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentDay: new Date().getDate(),
      currentMonthStartWeekIndex: null,
      currentCalendarMatrix: [],
      endOfDay: null,
      memoDatas: [],
      incomeData: [],
      expenseData: [],
      showTable: 'expense', // Add this line
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function () {
      this.currentMonthStartWeekIndex = this.getStartWeek(
        this.currentYear,
        this.currentMonth
      );
      this.endOfDay = this.getEndOfDay(this.currentYear, this.currentMonth);
      this.initCalendar();
      this.incomeData = [];
      this.expenseData = [];
    },
    initCalendar: function () {
      this.currentCalendarMatrix = [];
      let day = 1;
      for (let i = 0; i < 6; i++) {
        let calendarRow = [];
        for (let j = 0; j < 7; j++) {
          if (i == 0 && j < this.currentMonthStartWeekIndex) {
            calendarRow.push('');
          } else if (day <= this.endOfDay) {
            calendarRow.push(day);
            day++;
          } else {
            calendarRow.push('');
          }
        }
        this.currentCalendarMatrix.push(calendarRow);
      }
    },
    calculateTotal(type) {
      let total = 0;
      const data = type === 'income' ? this.incomeData : this.expenseData;
      data.forEach((item) => {
        total += item.amount;
      });
      return total;
    },

    getEndOfDay: function (year, month) {
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          return 31;
          break;
        case 4:
        case 6:
        case 9:
        case 11:
          return 30;
          break;
        case 2:
          if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            return 29;
          } else {
            return 28;
          }
          break;
        default:
          console.log('unknown month ' + month);
          return 0;
          break;
      }
    },
    getStartWeek: function (targetYear, targetMonth) {
      let year = this.rootYear;
      let month = 1;
      let sumOfDay = this.rootDayOfWeekIndex;
      while (true) {
        if (targetYear > year) {
          for (let i = 0; i < 12; i++) {
            sumOfDay += this.getEndOfDay(year, month + i);
          }
          year++;
        } else if (targetYear == year) {
          if (targetMonth > month) {
            sumOfDay += this.getEndOfDay(year, month);
            month++;
          } else if (targetMonth == month) {
            return (sumOfDay + 1) % 7; // 일요일을 첫번째 열로 변경
          }
        }
      }
    },
    onClickPrev: function (month) {
      month--;
      if (month <= 0) {
        this.currentMonth = 12;
        this.currentYear -= 1;
      } else {
        this.currentMonth -= 1;
      }
      this.init();
    },
    onClickNext: function (month) {
      month++;
      if (month > 12) {
        this.currentMonth = 1;
        this.currentYear += 1;
      } else {
        this.currentMonth += 1;
      }
      this.init();
    },
    isToday: function (year, month, day) {
      let date = new Date();
      return (
        year == date.getFullYear() &&
        month == date.getMonth() + 1 &&
        day == date.getDate()
      );
    },
  },
};
</script>

<style type="text/css">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.total {
  bottom: 10px;
  right: 10px;
  text-align: right;
  font-size: 28px;
}

.calendar {
  font-size: 18px; /* Increase font size */
  border: 2px solid #000; /* Add border to the calendar */
  padding: 10px; /* Add padding around the calendar */
}

.table {
  width: 100%; /* Make table width 100% */
  border-collapse: collapse; /* Collapse borders to avoid double borders */
  border: 2px solid #000; /* Add border around the table */
}

.table thead {
  border-bottom: 2px solid #000; /* Add bottom border to thead */
}

.table td {
  font-weight: bold;
  padding: 10px; /* Increase padding - 50px for all sides */
  border: 1px solid #000; /* Add border to each cell */
  position: relative; /* Set position to relative for td */
}

.table td:last-child {
  border-right: none; /* Remove right border for last column */
}

.table tr:last-child td {
  border-bottom: none; /* Remove bottom border for last row */
}
.table td > div {
  position: absolute; /* Set position to absolute for span */
  top: 6px; /* Position span at the top */
  left: 6px; /* Position span at the left */
}
.memo-textarea {
  width: 100%;
  height: 200px; /* 적절한 높이 조정 */
  resize: none;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  text-align: left; /* 텍스트를 왼쪽으로 정렬 */
  /* 텍스트가 위에서 시작하도록 */
  padding-top: 10px;
  padding-left: 10px;
}
.expense-table {
  border: 1px dashed gray;
  width: 100%;
}

.expense-title {
  border: 1px dashed gray;
}

.expense-title-row {
  border: 1px dashed gray;
}

.expense-data {
  border: 1px dashed gray;
}

.income-table {
  border: 1px dashed gray;
  width: 100%;
}

.income-title {
  border: 1px dashed gray;
}

.income-title-row {
  border: 1px dashed gray;
}

.income-data {
  border: 1px dashed gray;
}
.small-input {
  width: 80px; /* Adjust the width as per your requirement */
}
.form-select {
  text-align: center; /* Center-align text */
  text-align-last: center; /* Center-align the selected option in modern browsers */
}

</style>
