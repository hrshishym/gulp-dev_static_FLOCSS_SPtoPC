//-------------------------------------
// データインポート
import data from "../data/data.json" assert {type: "json" };

//-------------------------------------
// 初期設定
const image_dir = "./images/";
let count = 0; // 現在の問題番号
let q_sel = 4; // 選択肢の数
let answer_num = 0; // その問題の正解番号
let point = 0; // 最初の得点
const totalQuestions = 3; // 問題数
let q_arr = arrayShuffle([...Array(data.questions.length)].map((_, i) => i)); // 問題番号をシャッフル
let choices;
console.log(q_arr);

//-------------------------------------
// 要素の取得
// 共通
const question_num = document.querySelector('.question__num'); // 問題番号
// セクション
const section_q = document.querySelector('.question'); // 問題セクション
const section_a = document.querySelector('.answer'); // 解答セクション
const section_r = document.querySelector('.result'); // 結果セクション
const sections = [section_q, section_a, section_r];
// 問題セクション内要素
const text_q = document.querySelector('.text_q'); // 問題文
const text_c = document.querySelector('.text_c'); // 選択肢
const image = document.querySelector('.image img'); // サムネイル
const button_gotod = document.querySelector('#gotoAnswer');
const correct = document.querySelector('.correct'); // ◯
const incorrect = document.querySelector('.incorrect'); // ✕

// 解答セクション内要素
const text_a = document.querySelector('.text_a'); // 解答
const text_d = document.querySelector('.text_d'); // 説明
const movie = document.querySelector('.movie'); // 動画div
const movie_url = document.querySelector('.movie a'); // 動画へのリンク
const movie_thumb = document.querySelector('.movie img'); // 動画のサムネイル
const link = document.querySelector('.answer .link a'); // 次の問題へのリンク
// 結果セクション内要素
const result_point = document.querySelector('.result_gotpoint'); // ポイント数
const result_total = document.querySelector('.result_totalpoint'); // トータルポイント
const result_rank = document.querySelector('.result_rank'); // ランク

//-------------------------------------
// セクション表示非表示
function showSection(section) {
  sections.forEach((each) => {
    each.style.display = "none";
  });
  section.style.display = "block";
}
window.showSection = showSection;

//-------------------------------------
// 問題の表示
const quiz = function (count, q_num) {
  // 要素の非表示
  button_gotod.style.display = "none";
  correct.style.display = "none";
  incorrect.style.display = "none";

  // 問題
  // text_q.innerHTML = (count + 1) + "問目:" + data.questions[q_num].question;
  question_num.innerHTML = "Q" + (count + 1);
  text_q.innerHTML = data.questions[q_num].question;

  // サムネイル
  const image_src = data.questions[q_num].thumbnail;
  if (image_src != "") {
    image.src = image_dir + image_src + ".webp";
  } else {
    image.src = "https://dummyimage.com/670x376/000/fff&text=No+Image";
  }

  // 選択肢
  let s = "";
  choices = [...data.questions[q_num].choices];
  choices = arrayShuffle(choices);
  console.log("選択肢シャッフル：" + choices);
  for(let i = 0; i < choices.length; i++) {
    // s += " 【<a href='javascript:void(0);' onclick='answer(" + i + ");' id='choice" + i + "'>" + (i+1) + " : " + choices[i] + "</a>】";
    s += " 【<a href='javascript:void(0);' onclick='check(" + i + ");' id='choice" + i + "' class='choice'>" + (i+1) + " : " + choices[i] + "</a>】<br>";
    answer_num = (choices[i] == data.questions[q_num].choices[0]) ? i : answer_num;
    console.log("選択肢シャッフル： choices[i]:" + choices[i] + " / data.questions[q_num].choices[0]:" + data.questions[q_num].choices[0]);
    console.log("選択肢シャッフル： answer_num: " + answer_num);
  }
  text_c.innerHTML = s;
}
window.quiz = quiz;

//-------------------------------------
// 答え合わせ
const check = function (num) {
  const question = data.questions[q_arr[count]];
  const button = document.querySelector('#choice' + num);

  // 選択肢のクリックを無効化
  document.querySelectorAll('.choice').forEach((each) => {
    each.setAttribute('onclick', "");
  });

  if (choices[num] == choices[answer_num]) {
    // 正解
    button.style.backgroundColor = "lightgreen";
    correct.style.display = "block";
    point++;
  } else {
    button.style.backgroundColor = "pink";
    incorrect.style.display = "block";
  }

  button_gotod.setAttribute('onclick', 'answer(' + num + ');');
  button_gotod.style.display = "block";
}
window.check = check;

//-------------------------------------
// 解答の表示
const answer = function (num) {
  let s;
  const question = data.questions[q_arr[count]];
  // s = (count + 1) + "問目:";
  // // 答え合わせ
  // console.log("num: " + num);
  // console.log("answer_num: " + answer_num);
  // console.log("choices[num]: " + choices[num]);
  // console.log("choices[answer_num]: " + choices[answer_num]);
  // if (choices[num] == choices[answer_num]) {
  //   // 正解
  //   s += "◯" + choices[num];
  //   point++;
  // } else {
  //   s += "✕" + choices[num];
  // }
  // text_a.innerHTML = s;

  // 答えの表示
  text_a.innerHTML = "A. " + choices[answer_num];

  // 説明
  text_d.innerHTML = question.description;

  // 動画へのリンク
  const url = question.youtube;
  // const thumb = url.replace("https://www.youtube.com/watch?v=", "");
  // movie_url.setAttribute('href', url);
  // movie_thumb.src = "https://img.youtube.com/vi/" + thumb + "/maxresdefault.jpg";
  movie.innerHTML = '<iframe width="560" height="315" src="' + url + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
  // リンクの更新
  count++;
  console.log("count: " + count);
  // if (count < data.questions.length) {
  if (count < totalQuestions) {
    const link_next = "showNext(" + count + "," + q_arr[count] + ");";
    console.log(link_next);
    link.setAttribute('onclick', link_next);
    // quiz(count, q_arr[count]);
  } else {
    // 終了
    console.log("終了");
    link.innerHTML = "結果をみる";
    link.setAttribute('onclick', "showResult();");
  }

  showSection(section_a);

}
window.answer = answer;

//-------------------------------------
// 次の問題の表示
function showNext(count, q_num) {
  quiz(count, q_arr[count]);
  showSection(section_q);
}
window.showNext = showNext;

//-------------------------------------
// 結果の表示
function showResult() {
  result_point.innerHTML = point * 10;
  result_total.innerHTML = totalQuestions * 10;
  // section_q.style.display = "none";
  // section_a.style.display = "none";
  // section_r.style.display = "block"
  if(point < 1) {
    result_rank.innerHTML = "がんばりましょう";
  } else if(point < 2) {
    result_rank.innerHTML = "のびしろいっぱい";
  } else if(point < 3) {
    result_rank.innerHTML = "かなりすごいです";
  } else {
    result_rank.innerHTML = "とってもすごいです";
  }
  showSection(section_r);
}
window.showResult = showResult;

//-------------------------------------
// 初期化
function init() {
  count = 0;
  point = 0;
  q_arr = arrayShuffle([...Array(data.questions.length)].map((_, i) => i)); // 問題番号をシャッフル
  link.innerHTML = "次の問題へ進む";
  quiz(count, q_arr[count]);
  showSection(section_q);
}
window.init = init;

//-------------------------------------
// メイン
if(section_q) {
  // quiz(count, q_arr[count]);
  init();
}

