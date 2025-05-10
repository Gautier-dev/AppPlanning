<template>
  <img src="/logo_app_planning.svg />
  <input v-model="passwordC" placeholder="Entrer un mdp si nécessaire" />
  <button>Creer une instance</button>
  <h3 v-show="PlanningCreated">Voici votre id d'instance : {{ PlanningId }}</h3>
  <input v-model="PlanningIdConnect" placeholder="Entrer un id d'instance" />
  <input v-model="passwordConnect" placeholder="Entrer un mdp si nécessaire" />
  <button>Rejoindre une instance<button>
</template>
<script>
export default {
data() {
return {
 PlanningCreated: false,
 PlanningId: -1
 
};
},
methods: {
  async CreatePlanning() {
    var passwordSent = ""
    if (this.passwordC != "") { 
    passwordSent = await window.crypto.subtle.digest("SHA-256", this.passwordC);
    }
    const planningIDs = await fetch("SELECT planning_id FROM plannings")     
    var new-planning-id = Math.floor(Math.random() * 100000)
    while (new-planning-id in planningIDs) {
      new-planning-id = Math.floor(Math.random() * 100000)
    }
    this.PlanningId = new-planning-id
    await fetch("INSERT INTO plannings (planning_id, planning_password) values ")
    this.InstanceCreated = true
  },
  async JoinPlanning() {     
    $router.push({ path: '/current-week', query: { planningid: this.PlanningIdConnect }})

  }
}

}

