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

  submited: boolean = false;

  constructor(private http: HttpClient) {

    this.http.get('assets/json/QuestionAnswer.json').subscribe((res) => {

      this.shuffle(res);

      this.jsonDataResult = JSON.parse(JSON.stringify(res));
      this.rightAnswer = JSON.parse(JSON.stringify(this.jsonDataResult));

      for (let i = 0; i < this.jsonDataResult.length; i++) {
        this.jsonDataResult.forEach(jd => {

          jd.trueAnswersIndex = [];

          this.shuffle(jd.answers);

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
    arr.push(this.rightAnswer[this.currentIndex].answers.findIndex(fi => fi.content == answer.content));
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
            arr.push(this.rightAnswer.find(rfi => rfi.index == ans.index)!.answers.findIndex(afi => afi.content == element.content));
          }
        });
        userAnswerMap.set(ans.index, arr);
      }
    });

    console.log('--- userAnswerMap :: ', userAnswerMap);
    console.log('--- correctAnswerMap :: ', correctAnswerMap);

    let tempList: Array<number> = [];

    correctAnswerMap.forEach((value, key) => {
      let tmpUserAnswer = userAnswerMap.get(key);
      let tmpCorrectAnswer = correctAnswerMap.get(key);

      tmpUserAnswer!.sort();
      tmpCorrectAnswer!.sort();

      if (JSON.stringify(tmpUserAnswer) != JSON.stringify(tmpCorrectAnswer)) {
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

    if (JSON.stringify(this.wrongAnserQuestIndex) == "[]") {
      alert("Congratrulations to you, all answers are correct!!!")
    }

    this.submited = true;

    // console.log('--- jsonDataResult :: ', this.jsonDataResult);
    // console.log('--- rightAnswer :: ', this.rightAnswer);

  }

  /**
   * changeBackgroColor
   * @param key 
   * @returns 
   */
  changeBackgroColor(key: number): string {
    if (this.submited) {
      if (this.wrongAnserQuestIndex.indexOf(key) == -1) {
        return 'green';
      } else {
        return 'red';
      }
    } else {
      return 'white';
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
