<template>
  <!-- Entry form -->
  <div class="player-form" v-if="store.visibleJoiningForm">
    <div class="form-cont">

      <div class="input">
        <label for="user">Your Name</label>
        <input type="text" name="user" class="player" id="user" autocomplete="off" v-model="user"
          placeholder="Entry your name" required />
      </div>

      <div>
        <button type="submit" class="submit-btn" @click="handleSubscribe()">Start</button>
      </div>

    </div>
  </div>

  <!-- Waiting div -->

  <div class="wait-cont" v-if="store.visibleLoading">
    <h1 class="wait">Waiting for opponent</h1>
    <div class="loader"></div>
  </div>

  <!-- Winner Result -->
  <div class="win-modal" v-if="store.visibleResult">
    <div class="msg-cont">
    <!-- Score Board -->

      <div class='scoreBoard'>
        <p class="scr1 scr">0</p>
        <p class="scr2 scr">0</p>
      </div>

      <p class="msg">{{ winner.user }} won</p>

      <div>
        <!-- <button class="btn" style="margin-top: 20px;" @click="startNewGame()">New game</button>-->
        <button class="btn rematch" style="margin-top: 20px;" @click="rematch()">Rematch</button> 
        <button class="btn" style="margin-top: 20px;" @click="store.hideResult()">Close</button>
      </div>

    </div>
  </div>

  <div v-if="store.visibleGame">

    <!-- Score Board -->
    <div class="score">
      <div class=' scoreBoard'>
        <p class="scr1 scr">0</p>
        <p class="scr2 scr">0</p>
      </div>
    </div>

    <div class="container">



      <div class="user-cont">
        <p class="user" id="user1">{{ self.user }}</p>
        <p class="user" id="user2">{{ opp.user }}</p>
      </div>

      <div class="game">
        <button class="box disabled:bg-black" v-for="(arr , index) in store.arrs" :id="`box${index}`" @click="play(index)"><p>{{ arr }}</p></button>
      </div>
    </div>

    <!-- <div>
      <button class="btn" id="new" style="margin-top: 20px;" @click="startNewGame()">New game</button>
      <button id="reset" class="btn reset" @click="resetGame()">Reset</button>
    </div> -->
  </div>
</template>

<script setup>
import { useMainStore } from './mainStore';
import PieSocket from "piesocket-js";
import { ref } from 'vue';

const store = useMainStore();

let joinedUser = [];
let user = ref('')
let self = ''
let opp = ''
var channel;
let turnValue;
let winner;
let turnName;


const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8]
];

const handleSubscribe = () => {
  var pieSocket = new PieSocket({
    clusterId: "free.blr2",
    apiKey: '2ZilnOus6sDs7od7bbVYQgx8LlgAfabf7yGLJlUt',
    notifySelf: false,
    presence: true,
    userId: user.value
  });

  pieSocket.subscribe("chat-room").then(ch => {
    channel = ch;

    channel.listen("system:member_joined", function (data) {
      if (data.member.user == user.value) {
        self = data.member
      }
      else {
        opp = data.member;
      }

      joinedUser.push(data.member);
      store.hideJoiningForm();
      store.showLoading();

      console.log(joinedUser.length);
      if (joinedUser.length >= 2) {
        // let time = new Date();
        // const hour = time.getHours();
        // const minute = time.getMinutes();
        // const second = time.getSeconds();

        // const min = 1000;
        // const max = 1000000;

        // const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        // let roomName = hour + '' + minute + '' + second + '' + randomNumber;
        // let roomPlayer = {
        //   player1: self,
        //   player2: opp
        // }
        channel.publish('request-start-game', {
          sendFrom: self,
          sendTo: opp,
          // room: roomName,
        })
        turnValue = 'o'
        turnName = self;
         
        store.hideLoading();
        store.showGame()

        // if (rooms[roomName]) {
        //   rooms[roomName].push(roomPlayer)
        // } else {
        //   rooms[roomName] = []
        //   rooms[roomName].push(roomPlayer)
        // }


        // const selfIndex = joinedUser.indexOf(self);
        // if (selfIndex !== -1) {
        //   joinedUser.splice(selfIndex, 1); 7 + 6
        // }


        // const oppIndex = joinedUser.indexOf(opp);
        // if (oppIndex !== -1) {
        //   joinedUser.splice(oppIndex, 1);
        // }

        // console.log('rooms', rooms);
        // console.log('users', joinedUser);
        // console.log('users', joinedUser.length);

      }

      if (joinedUser.length > 2) {
        console.log('Room is fool');
      }

      channel.listen('request-start-game', function (data) {

        if (data.sendTo.uuid == self.uuid) {
          store.hideLoading();
          store.showGame();
          turnValue = 'x'
          turnName = self;
          store.toogleTurn();
          opp = data.sendFrom
          // const selfIndex = joinedUser.indexOf(self);
          // if (selfIndex !== -1) {
          //   joinedUser.splice(selfIndex, 1); 7 + 6
          // }

          // channel.publish('request-accept', {
          //   acceptFor: data.sendFrom,
          //   message: 'accepted'
          // })
        } else {
          console.log('its not me');
        }
        // roomPlayer = {

        // }
        // if (rooms[data.room]) {
        //   rooms[data.room].push(roomPlayer)
        // } else {
        //   rooms[data.room] = []
        //   rooms[data.room].push(roomPlayer)
        // }
      })

      // channel.listen('request-accept', function(data){
      //   if(data.acceptFor.uuid == self.uuid){
      //     console.log(data);
      //   }
      // })
      // console.log(data.member.user + " joined");
    });

    
    channel.listen('play-turn', function(data){
      store.setArrays(data);
      store.toogleTurn();
      store.disableButton(data.box);
      let button = document.getElementById(`box${data.box}`)
      console.log(button);
      button.disabled = true;
      checkWinner();
    })
  });
  
}
const play = (index) => {
  if(store.turnSelf){
    channel.publish('play-turn', {
      box: index,
      val: turnValue,
    })
  }
}

const checkWinner = () => {
  winPatterns.forEach(pattern => {
    let pos1val = store.arrs[pattern[0]];
    let pos2val = store.arrs[pattern[1]];
    let pos3val = store.arrs[pattern[2]];
    if(pos1val != '' && pos2val != '' && pos3val != '') {
      if(pos1val === pos2val && pos2val === pos3val) {
        if(pos1val === turnValue){
          winner = self;
        } else{
          winner = opp;
        }
        store.showResult();
      }
    }
  });
}


const requestForRematch = () => {
  channel.publish('requestRematch', {

  })
}
</script>
