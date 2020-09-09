const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy
const FacebookStrategy = require("passport-facebook").Strategy
const { compareSync } = require("bcrypt")
const User = require("../models/User")

//#region Estrategia Local

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })

        if (!user) return done(null, false, { message: "Error, intenta de nuevo" })

        if (!compareSync(password, user.password))
          return done(null, false, { message: "Password incorrecto" })

        done(null, user)
      } catch (error) {

        console.error(error)

        done(error)
      }
    }
  )
)

//#endregion

//#region Google

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {

      const user = await User.findOne({ googleID: profile.id })
      
      const checkEmail = await User.findOne({email: profile.emails[0].value})

      if (!user && checkEmail) 
        return done(null, false, { message: "Este email ya esta asociado"})

      if (!user) {
        const user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleID: profile.id,
          profilePicture: profile.photos[0].value
        })
        done(null, user)
      }
      done(null, user)
    }
  )
)


//#endregion

//#region Facebook

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: `${process.env.SITE}/auth/facebook/callback`,
      profileFields: ["id", "email", "gender", "link", "name", "photos"]
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({
        facebookID: profile.id
      })

      const checkEmail = await User.findOne({
        email: profile.emails[0].value
      })

      if (!user && checkEmail) 
        return done(null, false, { message: "Este email ya esta asociado"})

      if (!user && !checkEmail) {
        const user = await User.create({
          username: profile.displayName || `${profile.name.givenName || ""} ${profile.name.familyName || ""}`,
          facebookID: profile.id,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0].value
        })
        done(null, user)
      }
      done(null, user)
    }
  )
)

//#endregion

//#region Serializer y Deserializer

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    user.password = "";
    done(null, user )
  } catch (error) {
    done(error)
  }
})

//#endregion

module.exports = passport