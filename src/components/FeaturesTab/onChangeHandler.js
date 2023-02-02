const handlePlans = ({
    id,
    checkAccordionSelectionCompatibility,
    state,
    nextSelectedValues,
    nextSelectedValuesMeta,
    checked,
    setTagState,
    setState,
}) => {
    if (
        checked &&
        checkAccordionSelectionCompatibility(
            state.uiData.selected.tableRows,
            nextSelectedValuesMeta,
            'plans'
        ) === true
    ) {
        setTagState({
            selectedValues: nextSelectedValues,
            selectedValuesMeta: nextSelectedValuesMeta,
        });
        setState((v) => ({
            ...v,
            uiData: {
                ...v.uiData,
                lastAction: 'checkableTagsChanged',
                selected: {
                    ...v.uiData.selected,
                    [id]: nextSelectedValuesMeta,
                },
            },
            tableData: {
                ...v.tableData,
                shouldUpdatePlans: true,
            },
        }));
    } else if (!checked) {
        setTagState({
            selectedValues: nextSelectedValues,
            selectedValuesMeta: nextSelectedValuesMeta,
        });
        setState((v) => ({
            ...v,
            uiData: {
                ...v.uiData,
                lastAction: 'checkableTagsChanged',
                selected: {
                    ...v.uiData.selected,
                    [id]: nextSelectedValuesMeta,
                },
            },
            tableData: {
                ...v.tableData,
                shouldUpdatePlans: true,
            },
        }));
    }
};

const handleDeals = ({
    id,
    nextSelectedValues,
    nextSelectedValuesMeta,
    setTagState,
    setState,
}) => {
    setTagState({
        selectedValues: nextSelectedValues,
        selectedValuesMeta: nextSelectedValuesMeta,
    });
    setState((v) => ({
        ...v,
        uiData: {
            ...v.uiData,
            lastAction: 'checkableTagsChanged',
            selected: {
                ...v.uiData.selected,
                [id]: nextSelectedValuesMeta,
            },
        },
        tableData: {
            ...v.tableData,
            shouldUpdateDeals: true,
        },
    }));
};

const handleAddOns = ({
    id,
    checkAccordionSelectionCompatibility,
    state,
    nextSelectedValues,
    nextSelectedValuesMeta,
    checked,
    setTagState,
    setState,
    option,
}) => {
    if (
        checked &&
        checkAccordionSelectionCompatibility(
            state.uiData.selected.tableRows,
            nextSelectedValuesMeta,
            'addOns'
        ) === true
    ) {
        setTagState({
            selectedValues: nextSelectedValues,
            selectedValuesMeta: nextSelectedValuesMeta,
        });
        setState((v) => ({
            ...v,
            uiData: {
                ...v.uiData,
                lastAction: 'checkableTagsChanged',
                selected: {
                    ...v.uiData.selected,
                    [id]: nextSelectedValuesMeta,
                },
            },
            stepControllerFeedback: checked
                ? {
                      ...v.stepControllerFeedback,
                      modal: {
                          display: true,
                          lazyLoad: 'AddOnModal',
                          lazyProps: {
                              selected: option,
                          },
                          onCancel: (__state, __setState) => () => {
                              const currentAddOns =
                                  __state.uiData.selected.addOns;
                              const { socCode } = option.meta;
                              let newAddOns = [];
                              if (currentAddOns.length > 0) {
                                  newAddOns = currentAddOns.filter((item) => {
                                      item.quantity = item.quantity || 1;
                                      return item.socCode !== socCode;
                                  });
                              }
                              __setState((_s) => ({
                                  ..._s,
                                  uiData: {
                                      ..._s.uiData,
                                      selected: {
                                          ..._s.uiData.selected,
                                          addOns: newAddOns,
                                      },
                                      lastAction: 'closeModal',
                                  },
                                  stepControllerFeedback: {
                                      ...v.stepControllerFeedback,
                                      modal: {
                                          display: false,
                                          message: '',
                                          footer: null,
                                          onOk: null,
                                          onCancel: null,
                                          maskClosable: true,
                                          lazyLoad: null,
                                          lazyProps: {},
                                          title: '',
                                      },
                                  },
                              }));
                          },
                      },
                  }
                : v.stepControllerFeedback,
        }));
    } else if (!checked) {
        setTagState({
            selectedValues: nextSelectedValues,
            selectedValuesMeta: nextSelectedValuesMeta,
        });
        setState((v) => ({
            ...v,
            uiData: {
                ...v.uiData,
                lastAction: 'checkableTagsChanged',
                selected: {
                    ...v.uiData.selected,
                    [id]: nextSelectedValuesMeta,
                },
            },
        }));
    }
};

export default function onChangeHandler({
    id,
    multiSelect,
    checkAccordionSelectionCompatibility,
    useTag: [{ selectedValues, selectedValuesMeta }, setTagState],
    state,
    setState,
}) {
    return (option, checked) => {
        let nextSelectedValues;
        let nextSelectedValuesMeta;
        const { value } = option;
        const meta = {
            ...option.meta,
            value,
        };

        if (multiSelect) {
            if (state.uiData.lastAction === 'resetSelected') {
                nextSelectedValues = checked
                    ? [value]
                    : selectedValues.filter((v) => v !== value);
                nextSelectedValuesMeta = checked
                    ? [meta]
                    : selectedValuesMeta.filter(
                          (selectedMeta) => selectedMeta.value !== value
                      );
            } else {
                nextSelectedValues = checked
                    ? [...selectedValues, value]
                    : selectedValues.filter((v) => v !== value);
                nextSelectedValuesMeta = checked
                    ? [...selectedValuesMeta, meta]
                    : selectedValuesMeta.filter(
                          (selectedMeta) => selectedMeta.value !== value
                      );
            }
        } else {
            nextSelectedValues = [value];
            nextSelectedValuesMeta = [meta];
            if (!checked) {
                nextSelectedValues = [];
                nextSelectedValuesMeta = [];
            }
        }

        const handlerProps = {
            id,
            checkAccordionSelectionCompatibility,
            state,
            nextSelectedValues,
            nextSelectedValuesMeta,
            checked,
            setTagState,
            setState,
            option,
        };

        const handle = {
            plans: handlePlans,
            deals: handleDeals,
            addOns: handleAddOns,
        };

        return handle[id] ? handle[id](handlerProps) : null;
    };
}
