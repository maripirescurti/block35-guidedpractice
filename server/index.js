// imports
const { 
  client,
  createTables,
  createUser,
  createSkill,
  createUserSkill,
  fetchUsers,
  fetchSkills,
  fetchUserSkills,
  deleteUserSkill
} = require('pg');

const express = require('express');
const app = express();
app.use(express.json());

//APP ROUTES
// get - read
app.get('/api/users', async(req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch(ex) {
    next(ex);
  }
});

app.get('/api/skills', async(req, res, next) => {
  try {
    res.send(await fetchSkills());
  } catch(ex) {
    next(ex);
  }
});

app.get('/api/users/:id/userSkills', async(req, res, next) => {
  try {
    res.send(await fetchUserSkills(req.params.id));
  } catch(ex) {
    next(ex);
  }
});

// post - create
app.post('/api/users/:id/userSkills', async(req, res, next)=> {
  try {
    res.status(201).send(await createUserSkill({ 
      user_id: req.params.id, 
      skill_id: req.body.skill_id
    }));
  } catch(ex) {
    next(ex);
  }
});

// delete
app.post('/api/users/:userId/userSkills/:id', async(req, res, next)=> {
  try {
    await deleteUserSkill({ 
      user_id:req.params.userId,
      id: req.params.id
    });
    res.status(201);
  } catch(ex) {
    next(ex);
  }
});

// init function
const init = async() => {
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');
  const [moe, lucy, ethyl, singing, dancing, juggling, plateSpinning] = await Promise.all([
    createUser({ username: 'moe', password: 's3cr3t' }),
    createUser({ username: 'lucy', password: 's3cr3t!!' }),
    createUser({ username: 'ethyl', password: 'shhh' }),
    createSkill({ name: 'singing'}),
    createSkill({ name: 'dancing'}),
    createSkill({ name: 'juggling'}),
    createSkill({ name: 'plate spinning'}),
  ]);

  const users = await fetchUsers();
  console.log(users);

  const skills = await fetchSkills();
  console.log(skills);

  const userSkills = await Promise.all([
    createUserSkill({ user_id: moe.id, skill_id: plateSpinning.id}),
    createUserSkill({ user_id: moe.id, skill_id: juggling.id}),
    createUserSkill({ user_id: ethyl.id, skill_id: juggling.id}),
    createUserSkill({ user_id: lucy.id, skill_id: dancing.id}),
  ]);
  console.log(await fetchUserSkills(moe.id));
  await deleteUserSkill(userSkills[0].id);
  console.log(await fetchUserSkills(moe.id));

  console.log(`CURL localhost:3000/api/users/${lucy.id}/userSkills`);
  console.log(`CURL -X POST localhost:3000/api/users/${lucy.id}/userSkills -d '{"skill_id":"${plateSpinning.id}"}' -H 'Content-Type:application/json'`);
  console.log(`CURL -X DELETE localhost:3000/api/users/${lucy.id}/userSkills/${userSkills[3].id}'`);

  console.log('data seeded');

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> console.log(`listening on ${port}`));

};


init ();