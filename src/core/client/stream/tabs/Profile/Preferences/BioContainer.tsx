import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { MAX_BIO_LENGTH } from "coral-common/constants";
import { MarkdownEditor } from "coral-framework/components/loadables";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { parseEmptyAsNull } from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { validateMaxLength } from "coral-framework/lib/validation";
import { Flex, HorizontalGutter, HorizontalRule } from "coral-ui/components/v2";
import { Button, CallOut, ValidationMessage } from "coral-ui/components/v3";

import { BioContainer_settings } from "coral-stream/__generated__/BioContainer_settings.graphql";
import { BioContainer_viewer } from "coral-stream/__generated__/BioContainer_viewer.graphql";

import RemainingCharactersContainer from "../../Comments/RemainingCharacters";
import UpdateBioMutation from "./UpdateBioMutation";

import styles from "./BioContainer.css";

interface Props {
  viewer: BioContainer_viewer;
  settings: BioContainer_settings;
}

const BioContainer: FunctionComponent<Props> = ({ viewer, settings }) => {
  const updateBio = useMutation(UpdateBioMutation);
  const onRemoveBio = useCallback(() => {
    void updateBio({ bio: null });
  }, [updateBio]);
  const onSubmit = useCallback(
    async (formData: any) => {
      const { bio } = formData;
      try {
        await updateBio({ bio });
        return;
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }
        return { [FORM_ERROR]: err.message };
      }
    },
    [updateBio]
  );
  if (!settings.memberBios) {
    return null;
  }
  return (
    <HorizontalGutter>
      <HorizontalGutter spacing={1}>
        <Localized id="profile-bio-title">
          <h2 className={styles.title}>Bio</h2>
        </Localized>
        <Localized id="profile-bio-description">
          <p className={styles.description}>
            Write a bio to display publicly on your commenting profile. Must be
            less than 100 characters.
          </p>
        </Localized>
      </HorizontalGutter>
      <Form onSubmit={onSubmit} initialValues={{ bio: viewer.bio }}>
        {({
          handleSubmit,
          submitting,
          pristine,
          invalid,
          submitError,
          error,
        }) => (
          <form autoComplete="off" onSubmit={handleSubmit} id="bio-form">
            <HorizontalGutter>
              <Field
                name="bio"
                parse={parseEmptyAsNull}
                validate={validateMaxLength(MAX_BIO_LENGTH)}
              >
                {({ input, meta }) => (
                  <>
                    <MarkdownEditor
                      name={input.name}
                      onChange={input.onChange}
                      value={input.value}
                    />
                    <div>
                      {meta.error && (
                        <ValidationMessage
                          meta={meta}
                          justifyContent="flex-end"
                        />
                      )}
                      <RemainingCharactersContainer
                        max={MAX_BIO_LENGTH}
                        value={input.value}
                      />
                    </div>
                  </>
                )}
              </Field>

              {submitError && <CallOut color="error">{submitError}</CallOut>}
              <Flex itemGutter className={styles.buttons}>
                <Localized id="profile-bio-remove">
                  <Button
                    upperCase
                    color="error"
                    variant="outlined"
                    type="button"
                    onClick={onRemoveBio}
                    disabled={submitting || !viewer.bio}
                  >
                    Remove
                  </Button>
                </Localized>
                <Localized id="profile-bio-update">
                  <Button
                    upperCase
                    type="submit"
                    disabled={submitting || invalid || pristine}
                  >
                    Update
                  </Button>
                </Localized>
              </Flex>
            </HorizontalGutter>
          </form>
        )}
      </Form>
      <HorizontalRule />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment BioContainer_viewer on User {
      bio
    }
  `,
  settings: graphql`
    fragment BioContainer_settings on Settings {
      memberBios
    }
  `,
})(BioContainer);

export default enhanced;