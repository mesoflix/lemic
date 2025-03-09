import React, { useEffect } from "react";
import classNames from "classnames";
import { Field, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import Button from "@/components/shared_ui/button";
import Input from "@/components/shared_ui/input";
import MobileFullPageModal from "@/components/shared_ui/mobile-full-page-modal";
import Modal from "@/components/shared_ui/modal";
import RadioGroup from "@/components/shared_ui/radio-group";
import Text from "@/components/shared_ui/text";
import ThemedScrollbars from "@/components/shared_ui/themed-scrollbars";
import { config, save_types } from "@/external/bot-skeleton";
import { useStore } from "@/hooks/useStore";
import CryptoJS from "crypto-js";
import Blockly from "blockly";
import {
    DerivLightGoogleDriveIcon,
    DerivLightLocalDeviceIcon,
    DerivLightMyComputerIcon,
} from "@deriv/quill-icons/Illustration";
import { localize } from "@deriv-com/translations";
import { useDevice } from "@deriv-com/ui";
import IconRadio from "./icon-radio";
import "./save-modal.scss";

const SECRET_KEY = "binaryfx-secret-key"; // Keep this private

type TSaveModalForm = {
    bot_name: string;
    button_status: number;
    is_authorised: boolean;
    onConfirmSave: (values: { is_local: boolean; save_as_collection: boolean; bot_name: string }) => void;
    toggleSaveModal: () => void;
    validateBotName: (values: string) => { [key: string]: string };
    setCurrentFocus: (current_focus: string) => void;
};

const SaveModalForm: React.FC<TSaveModalForm> = ({
    bot_name,
    button_status,
    is_authorised,
    onConfirmSave,
    validateBotName,
    toggleSaveModal,
    setCurrentFocus,
}) => {
    const saveStrategy = () => {
        const workspace = Blockly.getMainWorkspace();
        if (!workspace) return;

        const workspaceJson = Blockly.serialization.workspaces.save(workspace);

        const strategyData = {
            app_id: "binaryfx-deriv",
            hash: "",
            data: workspaceJson,
        };

        // Generate security hash
        strategyData.hash = CryptoJS.SHA256(JSON.stringify(strategyData.data) + SECRET_KEY).toString();

        // Convert to Blob and trigger download
        const blob = new Blob([JSON.stringify(strategyData)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${bot_name || "strategy"}.binfx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Formik
            initialValues={{
                is_local: true,
                save_as_collection: false,
                bot_name: bot_name === config().default_file_name ? "" : bot_name,
            }}
            validate={validateBotName}
            onSubmit={onConfirmSave}
        >
            {({ values: { is_local }, setFieldValue, touched, errors }) => (
                <ThemedScrollbars height="500px" autohide>
                    <Form className={classNames("form--active-keyboard")}>
                        <div className="modal__content">
                            <Text size="xs" lineHeight="l">
                                {localize("Enter your bot name, choose save location, and click ")}
                                <strong>{localize("Save.")}</strong>
                            </Text>
                            <div className="modal__content-row">
                                <Field name="bot_name">
                                    {({ field }) => (
                                        <Input
                                            className="save-type__input"
                                            type="text"
                                            placeholder={localize("Untitled Strategy")}
                                            error={touched[field.name] && errors[field.name]}
                                            label={localize("Bot name")}
                                            onFocus={(e) => setCurrentFocus(e.currentTarget.value)}
                                            onBlur={() => setCurrentFocus("")}
                                            {...field}
                                        />
                                    )}
                                </Field>
                            </div>
                            <Button type="button" onClick={saveStrategy} primary text={localize("Save as .binfx")} />
                        </div>
                    </Form>
                </ThemedScrollbars>
            )}
        </Formik>
    );
};

const SaveModal = observer(() => {
    const { save_modal } = useStore();
    const { button_status, bot_name, is_save_modal_open, onConfirmSave, toggleSaveModal, validateBotName } =
        save_modal;

    return (
        <Modal
            title={localize("Save strategy")}
            className="modal--save"
            width="32.8rem"
            height="50rem"
            is_open={is_save_modal_open}
            toggleModal={toggleSaveModal}
        >
            <SaveModalForm
                bot_name={bot_name}
                button_status={button_status}
                is_authorised={true}
                onConfirmSave={onConfirmSave}
                validateBotName={validateBotName}
                toggleSaveModal={toggleSaveModal}
                setCurrentFocus={() => {}}
            />
        </Modal>
    );
});

export default SaveModal;
