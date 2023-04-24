let express = require(`express`);
let app = express();
let port = 3002;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})


// Раздача статики
app.use(express.static(`public`));


// Настройка handlebars
const hbs = require('hbs');
app.set('views', 'views');
app.set('view engine', 'hbs');

let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/contacts-app');

let contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: String,
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: String
}, {
    timestamps: true
});

let Contact = mongoose.model('contact', contactSchema);

app.get(`/`, async (req, res) => {
    let contacts = await Contact.find().sort({ lastName: 1 });
    res.render('index', {
        contacts: contacts
    });
});

app.get('/contact-show', async (req, res) => {
    let contacts = await Contact.find().sort({ lastName: 1 });
    let id = req.query.id;
    let contact = await Contact.findOne({ _id: id });
    res.render('index.hbs', {
        isShow: true,
        contact: contact,
        contacts: contacts
    });
});

app.get('/contact-edit', async (req, res) => {
    let id = req.query.id;
    let contact = await Contact.findOne({ _id: id });
    let contacts = await Contact.find().sort({ lastName: 1 });
    res.render('index', {
        isEdit: true,
        contact: contact,
        contacts: contacts
    })
});

app.post('/contact-edit', async (req, res) => {
    let id = req.query.id;
    let contact = await Contact.findOne({ _id: id });
    console.log(id);
    console.log(contact);
    contact.firstName = req.body.firstName;
    contact.lastName = req.body.lastName;
    contact.phoneNumber = req.body.phoneNumber;
    contact.email = req.body.email;

    try {
        contact.save();
        res.redirect(`/contact-edit?id=${id}&success=1`);
    } catch (err) {
        res.redirect(`/contact-edit?id=${id}&error=1`);
    }
    /* 
        D:\Programming\Lesson\.nodejs projects\contact-app\index.js:74
    contact.firstName = req.body.firstName;
                                 ^

    TypeError: Cannot read properties of undefined (reading 'firstName')
        at D:\Programming\Lesson\.nodejs projects\contact-app\index.js:74:34
        at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    */
});