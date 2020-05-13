const Member = require("../models/Member")
const { age, date } = require('../lib/utils')

module.exports = {
  index(req, res) {
      console.log(req.query)
  
      let {filter, page, limit} = req.query
  
      page = page || 1
      limit = limit || 2
  
      let offset = limit * (page-1)
  
      const params = {
        filter,
        page,
        limit,
        offset,
        callback(members) {
          const pagination = {
            total: Math.ceil(members[0].total/limit), 
            page
          }
          return res.render('members/index', { members, filter, pagination })
        }
      }
      Member.paginate(params) 
  },

  create(req, res) {
    Member.instructorsSelectOptions( (options) => {
      return res.render('members/create', { instructorOptions: options })
    })
  },

  post(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] === "")
        return res.send('Please, fill all the form.')
    }

    Member.create(req.body, function (member) {
      return res.redirect(`/members/${member.id}`)
    })
  },

  show(req, res) {
    Member.find(req.params.id, function (member) {
      if (!member) return res.send("Member not found.")

      member.birth = date(member.birth).birthDay

      return res.render("members/show", { member })
    })
  },

  edit(req, res) {
    Member.find(req.params.id, function (member) {
      if (!member) return res.send("Member not found.")
      
      member.birth = date(member.birth).iso

      Member.instructorsSelectOptions( (options) => {
        return res.render('members/edit', { member, instructorOptions: options })
    })
  })
},

  put(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] === "")
        return res.send('Please, fill all the form.')
    }

    Member.update(req.body, function () {
      return res.redirect(`/members/${req.body.id}`)
    })

  },

  delete(req, res) {
    Member.delete(req.body.id, function () {
      return res.redirect(`/members`)
    })
  }
}