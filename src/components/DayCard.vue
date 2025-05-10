<script setup>
import ListNames from './ListNames.vue'
defineProps({
Day: String,
dayNumber: Number
})



</script>

<template>
  <div class="day-card-container">
    <div class="day-info">
      <h1>{{ Day }} {{ dayNumber }}</h1>
    </div>
    <div class="time-section morning-section">
    <h2>Matin</h2>
    <div class="activity-control">
      <h2 style="color: black;font-size:150%;" v-show="activityM">{{ activityMorning }}</h2>
      <input v-show="!activityM" v-model="MorningActivityInput" placeholder="Nom de l'activité" class="activity-input"/>
      <button type="button" v-show="!activityM" @click="updateM()" class="btn primary">OK</button>
      <button type="button" v-show="activityM" @click="updateM()" class="btn secondary">Modifier l'activité</button>
    </div> 
    <div class="name-list-wrapper">
      <ListNames :day="Day" AMorPM="Matin" :dayNumber="dayNumber"/>
    </div>
    </div>
    <div class="time-section afternoon-section">
      <h2>Après-midi</h2>
      <div class="activity-control">
        <h2 style="color: black;font-size:150%;" v-show="activityA">{{ activityAfternoon }}</h2>
        <input v-show="!activityA" v-model="AfternoonActivityInput" placeholder="Nom de l'activité" class="activity-input"/>
        <button type="button" v-show="!activityA" @click="updateA()" class="btn primary">OK</button>
        <button type="button" v-show="activityA" @click="updateA()" class="btn secondary">Modifier l'activité</button>
      </div>
       <div class="name-list-wrapper">
         <ListNames :day="Day" AMorPM="Après-midi" :dayNumber="dayNumber"/>
      </div>
    </div>
  </div>
    
</template>

<script>
export default {
data() {
return {
 activityMorning: "",
 activityAfternoon: "",
 activityM: false,
 activityA: false
};
},
methods: {
  async updateM() {
    if (this.activityMorning == "") {
      await fetch(`http://51.44.85.115:8080/api/addActivity?name=${this.MorningActivityInput}&halfday=Matin&day=${this.Day}&dayNumber=${this.dayNumber}`)
    } else {
      await fetch(`http://51.44.85.115:8080/api/modifyActivity?name=${this.MorningActivityInput}&halfday=Matin&day=${this.Day}&oldname=${this.activityMorning}&dayNumber=${this.dayNumber}`)
    }
    this.activityMorning = this.MorningActivityInput;
    this.activityM = !this.activityM;
  },
  async updateA() {
    const PM = "Après-midi"
    if (this.activityAfternoon == "") {
      await fetch(`http://51.44.85.115:8080/api/addActivity?name=${this.AfternoonActivityInput}&halfday=${PM}&day=${this.Day}&dayNumber=${this.dayNumber}`)
    } else {
      await fetch(`http://51.44.85.115:8080/api/modifyActivity?name=${this.AfternoonActivityInput}&halfday=${PM}&day=${this.Day}&oldname=${this.activityAfternoon}&dayNumber=${this.dayNumber}`)
    }
    this.activityAfternoon = this.AfternoonActivityInput;
    this.activityA = !this.activityA;
  }
},
async mounted() {
 try {
 const result = await fetch(`http://51.44.85.115:8080/api/getRegisteredPersonsHalfDay?MorA=${this.AMorPM}&weekday=${this.day}&dayNumber=${this.dayNumber}`)
 if (!result.ok) {
      console.log(`Response status: ${result.status}`);
    }
 const json = await result.json()
 console.log(json)
for (let i=0;i<json.length;i++) {
console.log(json[i].name)
this.Names.push(json[i].name)
}
console.log(this.Names)
 } catch (e) {
   console.log(e.message)}
try {
const resultMorningActivity = await fetch(`http://51.44.85.115:8080/api/getActivity?halfday=Matin&day=${this.Day}&dayNumber=${this.dayNumber}`)
const resultAfternoonActivity = await fetch(`http://51.44.85.115:8080/api/getActivity?halfday=Après-midi&day=${this.Day}&dayNumber=${this.dayNumber}`)
const jsonAM = await resultMorningActivity.json()
const jsonPM = await resultAfternoonActivity.json()
if (jsonAM != "") {
  this.activityMorning = jsonAM[0].name
  this.activityM = true
}
if (jsonPM != "") {
  this.activityAfternoon = jsonPM[0].name
  this.activityA = true 
} 
} catch (e) {
  console.log(e)
}}}
</script>

<style scoped>
.day-card-container {
  display: flex; /* Arrange children horizontally */
  width: 100%; /* Take the full width */
  border: 1px solid #dcdcdc; /* Subtle border around the card */
  border-radius: 8px; /* Rounded corners */
  overflow: hidden; /* Ensures borders/shadows look clean */
  background-color: #ffffff; /* White background for the card */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
  margin-bottom: 15px; /* Add space under each card if used in a list */
}

.day-info,
.time-section {
  padding: 15px; /* Add internal spacing */
  display: flex; /* Use flexbox for vertical stacking within sections */
  flex-direction: column; /* Stack content inside sections vertically */
  flex: 1; /* Allow sections to grow and share space */
  /* border-right: 1px solid #dcdcdc; /* Vertical separator */
}

/* Optional: Adjust flex basis or grow if you want unequal column widths */
.day-info {
    flex: 0.5; /* Make the day/date column potentially narrower */
    min-width: 120px; /* Ensure it doesn't get too squished */
     justify-content: center; /* Center content vertically */
     align-items: center; /* Center content horizontally */
     background-color: #f8f9fa; /* Light background for the header */
     border-right: 1px solid #dcdcdc; /* Vertical separator */
}

.morning-section {
   border-right: 1px solid #dcdcdc; /* Vertical separator */
}

/* Remove the border-right from the last section */
.day-card-container > .time-section:last-child {
  border-right: none;
}

.day-info h1 {
  margin: 0; /* Remove default margin */
  font-size: 1.5em; /* Adjust font size */
  color: #333;
  text-align: center;
}

.time-section h2 {
  margin-top: 0; /* Remove top margin */
  margin-bottom: 10px; /* Space below the section title */
  font-size: 1.2em;
  color: #007bff; /* A blue color for titles */
  border-bottom: 1px solid #eee; /* Subtle line under title */
  padding-bottom: 5px;
}

.activity-control {
    margin-bottom: 10px;
}

.activity-control h3 {
  margin: 0 0 10px 0; /* Space below activity text */
  font-size: 1em;
  color: #555;
}

.activity-input {
  padding: 8px;
  margin-right: 5px; /* Space between input and button if on same line */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease;
}

.btn.primary {
  background-color: #28a745; /* Green color for OK */
  color: white;
}

.btn.primary:hover {
  background-color: #218838;
}

.btn.secondary {
  background-color: #ffc107; /* Yellow/Orange for Modifier */
  color: #212529;
}

.btn.secondary:hover {
  background-color: #e0a800;
}

.name-list-wrapper {
    flex-grow: 1; /* Make the list container fill the remaining vertical space */
    /* You need to give this wrapper or the ListNames component itself a max-height */
    /* for the 'scrollable list' text to become a reality */
    max-height: 200px; /* Adjust as needed */
    overflow-y: auto; /* Enable vertical scrolling */
    border: 1px solid #eee; /* Optional border around the list area */
    padding: 5px; /* Optional padding inside the list area */
    background-color: #fefefe; /* Slightly different background for the list */
}

</style>
