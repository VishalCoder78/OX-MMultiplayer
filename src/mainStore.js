import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
    state: () => ({
        visibleJoiningForm: true,
        visibleLoading: false,
        visibleGame: false,
        visibleResult: false,
        arrs : Array(9).fill(''),
        turnSelf: true,
        disabledButtonList: [],
    }),
    actions: {
        showJoiningForm() {
            this.visibleJoiningForm = true;
        },
        hideJoiningForm() {
            this.visibleJoiningForm = false;
        },
        showLoading() {
            this.visibleLoading = true;
        },
        hideLoading() {
            this.visibleLoading = false;
        },
        showGame() {
            this.visibleGame = true;
        },
        hideGame() {
            this.visibleGame = false;
        },
        showResult() {
            this.visibleResult = true;
        },
        hideResult() {
            this.visibleResult = false;
        },
        setArrays(data) {
            this.arrs[data.box] = data.val;
        },
        toogleTurn(){
            this.turnSelf = !this.turnSelf
        },
        disableButton(index){
            this.disabledButtonList.push(index);
        }
    }
});