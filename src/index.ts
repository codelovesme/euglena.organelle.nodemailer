
"use strict";
import * as euglena_template from "@euglena/template";
import * as euglena from "@euglena/core";
import { sys, js } from "cessnalib";
const nodemailer = require("nodemailer");

import Particle = euglena.AnyParticle;

export class Organelle extends euglena.alive.Organelle<particles.incoming.SapContent> {
    public static readonly NAME = "euglena.organelle.nodemailer"
    private sapContent: particles.incoming.SapContent;
    transport: any;
    constructor() {
        super(Organelle.NAME);
    }
    protected bindActions(addAction: (particleName: string, action: (particle: Particle, callback: (particle: Particle) => void) => void) => void): void {
        addAction(particles.incoming.Sap.NAME, (particle: particles.incoming.Sap, callback) => {
            this.sapContent = particle.data;
            this.getAlive();
        });
        addAction(particles.incoming.SendMail.NAME, (particle: particles.incoming.SendMail, callback: (particle: Particle) => void) => {
            let mailOptions = {
                from: particle.data.from,
                to: particle.data.to,
                subject: particle.data.subject,
                text: particle.data.text,
                html: particle.data.html
            }
            this.transport.sendMail(mailOptions, (err: any, info: any) => {
                let call = callback || this.send;
                if (err) {
                    call(new euglena_template.alive.particle.Exception(new sys.type.Exception(JSON.stringify(err)), this.sapContent.euglenaName));
                } else {
                    call(new particles.outgoing.MailSent(mailOptions,this.sapContent.euglenaName));
                }
            });
        });
    }
    private getAlive() {

        this.transport = nodemailer.createTransport({
            host: this.sapContent.host,
            port: this.sapContent.port,
            secure: this.sapContent.secure,
            auth: {
                user: this.sapContent.user,
                pass: this.sapContent.pass
            }
        });

        /**
         * send a notification to the Cytoplasm
         * to inform about the organelle has been ready to get requests
         * */
        this.send(new euglena_template.alive.particle.OrganelleHasComeToLife(this.name, this.sapContent.euglenaName));
    }
}

export namespace particles {
    export namespace incoming {
        export interface SapContent {
            euglenaName: string,
            host: string,
            port: number,
            secure: boolean,
            user: string,
            pass: string
        }
        export class Sap extends euglena.ParticleV2<SapContent>{
            public static readonly NAME = Organelle.NAME + ".sap";
            constructor(of: string, data: SapContent) {
                super(new euglena.MetaV2(Sap.NAME, of), data);
            }
        }
        export class SendMail extends euglena.ParticleV2<{ from: string, to: string, subject: string, text: string, html: string }> {
            public static readonly NAME = "SendMail";
            constructor(content: { from: string, to: string, subject: string, text: string, html: string }, of: string) {
                super(new euglena.MetaV2(SendMail.NAME, of), content);
            }
        }
    }
    export namespace outgoing {
        export class MailSent extends euglena.ParticleV2<{ from: string, to: string, subject: string, text: string, html: string }> {
            public static readonly NAME = "MailSent";
            constructor(content:{ from: string, to: string, subject: string, text: string, html: string },of: string) {
                super(new euglena.MetaV2(MailSent.NAME, of),content);
            }
        }
    }
    export namespace shared {

    }
}
