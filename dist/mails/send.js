"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const template_1 = require("./template");
const sendEmail = (name, email, phone, github_link, stopwatch_time) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mailTransporter = nodemailer_1.default.createTransport({
            service: "iCloud",
            auth: {
                user: "ranjhaniharshal@icloud.com",
                pass: process.env.APP_PASSWORD,
            },
        });
        let mailDetails = {
            from: "noreply@harshalranjhani.in",
            to: email,
            subject: `Your Response has been recorded! 🚀`,
            html: (0, template_1.mailTemplate)(name, email, phone, github_link, stopwatch_time),
        };
        const info = yield mailTransporter.sendMail(mailDetails);
        console.log("Email sent: " + info.response);
    }
    catch (e) {
        throw new Error(e.message);
    }
});
exports.sendEmail = sendEmail;
