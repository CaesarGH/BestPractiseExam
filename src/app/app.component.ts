import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Change Server: ng serve --host 10.61.217.16
  title = 'BestPractiseExam';
  wrongAnserQuestIndex: Array<number> = [];
  defaultQuestionAnswer: QuestionAnswer = {
    "question": "What could a PCF Stack trace help identify when viewing a Web Profile?",
    "answers": [{
      "content": "The execution timing for the PCF",
      "correct": false
    }, {
      "content": "The reason for a failed query",
      "correct": false
    }, {
      "content": "The query linked to the Widget",
      "correct": false
    }, {
      "content": "The PCF widget that is linked to the query",
      "correct": false
    }],
    "trueAnswersIndex": [0],
    "radioChoice": true,
    "index": 999
  }
  defaultValue: QuestionAnswer[] = [this.defaultQuestionAnswer];

  jsonDataResult: QuestionAnswer[] = JSON.parse(JSON.stringify(this.defaultValue));
  rightAnswer: QuestionAnswer[] = JSON.parse(JSON.stringify(this.defaultValue));
  currentIndex: number = 0;

  constructor(private http: HttpClient) {
    this.http.get('assets/json/QuestionAnswer.json').subscribe((res) => {
      this.shuffle(res);
      this.jsonDataResult = JSON.parse(JSON.stringify(res));
      this.rightAnswer = JSON.parse(JSON.stringify(this.jsonDataResult));
      for (let i = 0; i < this.jsonDataResult.length; i++) {
        this.jsonDataResult.forEach(jd => {
          jd.trueAnswersIndex = [];
          jd.answers.forEach(jda =>
            jda.correct = false
          )
        });
      }
      // console.log('--- jsonDataResult :: ', this.jsonDataResult);
      // console.log('--- rightAnswer :: ', this.rightAnswer);
    });
  }

  /**
   * saveRadioIndex
   * @param answer 
   */
  saveRadioIndex(answer: Answer) {
    let arr: Array<number> = [];
    arr.push(this.jsonDataResult[this.currentIndex].answers.indexOf(answer));
    this.jsonDataResult[this.currentIndex].trueAnswersIndex = arr;
  }

  /**
   * preQuestion
   * @returns 
   */
  preQuestion() {
    if (this.currentIndex < 0) {
      return
    }
    this.currentIndex--;
    let currentQuestion = this.currentIndex + 1
    // console.log("currentQuestion:" + currentQuestion);
  }

  /**
   * nextQuestion
   * @returns 
   */
  nextQuestion() {
    if (this.currentIndex > this.jsonDataResult.length) {
      return
    }
    this.currentIndex++;
    let currentQuestion = this.currentIndex + 1
    // console.log("currentQuestion:" + currentQuestion);
  }

  changeIndex(index: number) {
    this.currentIndex = index - 1;
    let currentQuestion = this.currentIndex + 1
    // console.log("currentQuestion:" + currentQuestion);
  }

  /**
   * Submit your answer
   */
  onSubmit() {
    if (JSON.stringify(this.rightAnswer) === JSON.stringify(this.jsonDataResult)) {
      alert("Congratrulations to you, all answers are correct!!!")
    } else {
      let correctAnswerMap = new Map<number, number[]>();
      let userAnswerMap = new Map<number, number[]>();
      this.rightAnswer.forEach(ans => {
        correctAnswerMap.set(ans.index, ans.trueAnswersIndex);
      });
      this.jsonDataResult.forEach(ans => {
        if (ans.trueAnswersIndex.length == 1) {
          userAnswerMap.set(ans.index, ans.trueAnswersIndex);
        } else {
          let arr: Array<number> = [];
          ans.answers.forEach(element => {
            if (element.correct) {
              arr.push(ans.answers.indexOf(element));
            }
          });
          userAnswerMap.set(ans.index, arr);
        }
      });

      console.log('--- userAnswerMap :: ', userAnswerMap);
      console.log('--- correctAnswerMap :: ', correctAnswerMap);

      let tempList: Array<number> = [];
      correctAnswerMap.forEach((value, key) => {
        if (JSON.stringify(userAnswerMap.get(key)) != JSON.stringify(correctAnswerMap.get(key))) {
          let answ: QuestionAnswer = this.defaultQuestionAnswer;
          this.jsonDataResult.forEach(element => {
            if (element.index == key) {
              answ = element;
            }
          });
          tempList.push(this.jsonDataResult.indexOf(answ));
        }
      });
      this.wrongAnserQuestIndex = tempList;

      // console.log('--- jsonDataResult :: ', this.jsonDataResult);
      // console.log('--- rightAnswer :: ', this.rightAnswer);
      // alert("You didn't pass the exam!!!")
    }
  }

  /**
   * changeBackgroColor
   * @param key 
   * @returns 
   */
  changeBackgroColor(key: number): string {
    if (this.wrongAnserQuestIndex.indexOf(key) == -1) {
      return 'white';
    } else {
      return 'red';
    }
  }

  shuffle(arr: any) {
    let i = arr.length;
    while (--i) {
      let j = Math.floor(Math.random() * i);
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
  }

}

export interface QuestionAnswer {
  question: string;
  answers: Answer[];
  trueAnswersIndex: number[];
  radioChoice: boolean;
  index: number;
}

export interface Answer {
  content: string;
  correct: boolean;
}
