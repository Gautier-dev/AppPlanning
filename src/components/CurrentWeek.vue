<script setup>
import DayCard from './DayCard.vue'
import { format, addDays, subDays } from 'date-fns'
const todayDay = format(new Date(), 'i')
const arrayDayNumbers = [0,0,0,0,0,0,0]
const dictDayNumbers = { Lundi: 0,
Mardi: 1,
Mercredi: 2,
Jeudi: 3,
Vendredi: 4,
Samedi: 5,
Dimanche: 6 }
arrayDayNumbers[todayDay-1] = new Date()
for (let i = todayDay;i<7;i++) {
  arrayDayNumbers[i] = addDays(arrayDayNumbers[i-1], 1)
}
for (let i = todayDay-2;i>=0;i--) {
  arrayDayNumbers[i] = subDays(arrayDayNumbers[i+1], 1)
}
for (let i = 0;i<7;i++) {
  arrayDayNumbers[i] = format(arrayDayNumbers[i], 'd') 
}
</script>

<template>
  <div class="day-card-container">
  <DayCard class="day-card" v-for="day in days" :Day="day" :dayNumber="arrayDayNumbers[dictDayNumbers[day]]" />
  <button @click="goToNextWeek">Aller à la prochaine semaine</button>
  </div>
</template>

<style scoped>
.day-card-container {
  width: 100%; /* Make the container take full width of its parent */
  /* You might need to set a max-height or height for scrolling to work */
  /* Example: */
  height: 100%; /* Adjust this value based on your layout needs */
}

.day-card {
  margin-bottom: 50px;
}

</style>

<script>
export default {
data() {
return {
days: ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
};
},
methods: {
    goToNextWeek() {
      this.$router.push('/next-week')
    }
}
}
 
</script>
