

<template>
<div>
  <div class="name-btn" v-for="name in Names">
    <div class="name">{{ name }}</div>
    <button type="button" @click="RemoveName(name)" style="color: red">X</button>
  </div>
  <input class="input-name" v-model="inputName"/>
  <button type="button" @click="AddName(inputName)">Ajouter un nom</button>
</div>
</template>

<script>
export default {
data() {
return {
 Names: []
};
},
methods: {
  async RemoveName(name) {
    try {
      await fetch(`http://51.44.85.115:8080/api/deletePerson?name=${name}&morningorafternoon=${this.AMorPM}&weekday=${this.day}&dayNumber=${this.dayNumber}`)
      for (let i = 0;i<this.Names.length;i++) {
        if (this.Names[i] == name) {
          this.Names.splice(i, 1)
        }
      }
    } catch (e) {
      console.log(e)
    }  
  },
  async AddName(name) {
    try {
      await fetch(`http://51.44.85.115:8080/api/addPerson?name=${name}&morningorafternoon=${this.AMorPM}&weekday=${this.day}&dayNumber=${this.dayNumber}`)
      this.Names.push(name)
    } catch (e) {
      console.log(e)
    }  
  }
},
props: {
 day: String,
 AMorPM: String,
 dayNumber: Number
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

}}
</script>

<style scope>
.input-name {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.name-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.name {
  margin-right: 10px
}


</style

