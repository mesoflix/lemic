import React from "react";
import { Formik, Form, Field } from "formik";
import Blockly from "blockly";
import CryptoJS from "crypto-js";
import Button from "@/components/shared_ui/button";
import Input from "@/components/shared_ui/input";
import Modal from "@/components/shared_ui/modal";
import { useStore } from "@/hooks/useStore";
import { localize } from "@deriv-com/translations";

const SECRET_KEY = "binaryfx-secret-key"; // Keep private

const SaveModal: React.FC = () => {
    const { save_modal } = useStore();
    const { bot_name, is_save_modal_open, toggleSaveModal } = save_modal;

    const saveStrategy = (values: { bot_name: string }) => {
        const workspace = Blockly.getMainWorkspace();
        if (!workspace) {
            alert("Error: Blockly workspace not found.");
            return;
        }

        const workspaceJson = Blockly.serialization.workspaces.save(workspace);

        const strategyData = {
            app_id: "binaryfx-deriv",
            hash: "",
            data: workspaceJson,
        };

        // Generate security hash
        strategyData.hash = CryptoJS.SHA256(JSON.stringify(strategyData.data) + SECRET_KEY).toString();

        // Save as JSON (.binfx)
        const blob = new Blob([JSON.stringify(strategyData)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${values.bot_name || "strategy"}.binfx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Modal title={localize("Save strategy")} is_open={is_save_modal_open} toggleModal={toggleSaveModal}>
            <Formik initialValues={{ bot_name: bot_name || "" }} onSubmit={saveStrategy}>
                {({ values }) => (
                    <Form>
                        <Field name="bot_name">
                            {({ field }) => <Input {...field} label={localize("Bot name")} />}
                        </Field>
                        <Button type="submit" primary text={localize("Save .binfx")} />
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default SaveModal;
