"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const euglena_template = require("@euglena/template");
const euglena = require("@euglena/core");
class Organelle extends euglena.alive.Organelle {
    constructor() {
        super(Organelle.NAME);
    }
    bindActions(addAction) {
        addAction(particles.incoming.Sap.NAME, (particle, callback) => {
            this.sapContent = particle.data;
            this.getAlive();
        });
        /**
         * TODO:
         * Add Actions below in this method "bindActions"
         *
         */
    }
    getAlive() {
        /**
         * TODO:
         * Write something to make state of the organelle that
         * organelle can take requests, and work.
         */
        /**
         * send a notification to the Cytoplasm
         * to inform about the organelle has been ready to get requests
         * */
        this.send(new euglena_template.alive.particle.OrganelleHasComeToLife(this.name, this.sapContent.euglenaName));
    }
}
Organelle.NAME = "CHANGE HERE WITH A UNIQUE NAME";
exports.Organelle = Organelle;
var particles;
(function (particles) {
    let incoming;
    (function (incoming) {
        class Sap extends euglena.ParticleV2 {
            /**
             *  TODO:
             * Add fields needed from outside
             * before started the organelle working
             */
            constructor(of, data) {
                super(new euglena.MetaV2(Sap.NAME, of), data);
            }
        }
        Sap.NAME = Organelle.NAME + ".sap";
        incoming.Sap = Sap;
    })(incoming = particles.incoming || (particles.incoming = {}));
})(particles = exports.particles || (exports.particles = {}));

//# sourceMappingURL=index.js.map
