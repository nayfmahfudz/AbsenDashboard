<template>
  <div class="h-screen bg-yellow-200">
    <div class="container mx-auto p-32">
      <div class="mx-auto max-w-xl">
        <div class="py-10 text-center"></div>

        <div class="bg-gray-200 rounded shadow w-auto flex flex-wrap">
          <img src="@/assets/logo.svg" alt="Logo" class="w-36 mx-auto py-4" />

          <form class="bg-grey-lightest px-10 py-10 " id="app" @submit="checkForm" method="post">
            <h1 class="text-xl text-gray-700 content-center font-medium">
              Login
            </h1>
            <div class="mb-3">
              <input v-model="user"
                class="border w-full p-3"
                name="email"
                type="text"
                placeholder="User"
              />
            </div>
             <p class="text-red-500 text-xs italic">{{ nameErr }}</p>
            <div class="mb-6">
              <input v-model="password"
                class="border w-full p-3"
                name="password"
                type="password"
                placeholder="**************"
              />
            </div>
             <p class="text-red-500 text-xs italic">{{ passwordErr }}</p>
            <div class="flex">
              <button
                class="
                  bg-red-400
                  rounded
                  hover:bg-primary-dark
                  w-full
                  p-4
                  text-sm text-white
                  uppercase
                  font-bold
                  tracking-wider
                "
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import md5 from "js-md5"
export default {
  el: "#app",
  data() {
    return {
      user: "",
      password: "",
       passwordErr: "",
      nameErr: "",
    };
  },
  methods: {
    checkForm: function (e) {
      e.preventDefault();
      if (this.user === "") {
        this.nameErr = "user is required.";
      } else if (this.password === "") {
        this.passwordErr = "password is required.";
      }else {
        const datapost = {
            email: this.user,
      password: this.password,
        };
       axios
            .post(
              `http://103.170.197.186:8000/users/login`,
              datapost
            )
            .then((response) => {
                
              if(response.data.status==="Success"){
                this.$swal(response.data.message);
                localStorage.user= JSON.stringify(response.data.user);
                this.$router.push('/admin');
              }else {this.$swal("Login Gagal");}
            }).catch((error) => {
               this.$swal(error.message);
              console.log(error);
            });
      }
    },
  },
};
</script>

